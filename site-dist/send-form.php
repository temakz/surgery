<?php

declare(strict_types=1);

define('FORM_HANDLER', true);

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 900;
const DUPLICATE_WINDOW = 600;
const MAX_REVIEW_FILE_SIZE = 5242880;

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$autoload = __DIR__ . '/vendor/autoload.php';
if (is_file($autoload)) {
  require_once $autoload;
}

function json_response(int $status, array $payload): void
{
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
  exit;
}

function reject(int $status, string $code, string $message): void
{
  json_response($status, [
    'ok' => false,
    'error' => $code,
    'message' => $message,
  ]);
}

function load_form_config(): array
{
  $localConfig = __DIR__ . '/form-config.php';
  if (!is_file($localConfig)) {
    reject(503, 'config_missing', 'Отправка формы временно недоступна.');
  }

  $config = require $localConfig;

  if (!is_array($config)) {
    reject(500, 'config_error', 'Временная ошибка настройки формы.');
  }

  return $config;
}

function form_definitions(): array
{
  return [
    'book' => [
      'allowed' => ['form_type', 'website', 'name', 'phone', 'service', 'comment', 'privacy_consent'],
      'required' => ['name', 'phone', 'service', 'comment', 'privacy_consent'],
      'lengths' => ['name' => 120, 'phone' => 40, 'service' => 180, 'comment' => 2000],
      'files' => [],
    ],
    'exo' => [
      'allowed' => ['form_type', 'website', 'name', 'phone', 'comment', 'privacy_consent'],
      'required' => ['name', 'phone', 'comment', 'privacy_consent'],
      'lengths' => ['name' => 120, 'phone' => 40, 'comment' => 2000],
      'files' => [],
    ],
    'online' => [
      'allowed' => ['form_type', 'website', 'name', 'phone', 'comment', 'privacy_consent'],
      'required' => ['name', 'phone', 'comment', 'privacy_consent'],
      'lengths' => ['name' => 120, 'phone' => 40, 'comment' => 2000],
      'files' => [],
    ],
    'review' => [
      'allowed' => ['form_type', 'website', 'name', 'phone', 'email', 'procedure', 'procedure_other', 'message', 'privacy_consent'],
      'required' => ['name', 'phone', 'email', 'procedure', 'message', 'photo', 'privacy_consent'],
      'lengths' => ['name' => 120, 'phone' => 40, 'email' => 254, 'procedure' => 180, 'procedure_other' => 180, 'message' => 5000],
      'files' => ['photo'],
    ],
  ];
}

function request_ip(): string
{
  $ip = $_SERVER['REMOTE_ADDR'] ?? '';
  return is_string($ip) && $ip !== '' ? $ip : 'unknown';
}

function hashed_ip(): string
{
  return hash_hmac('sha256', request_ip(), hash('sha256', __DIR__));
}

function field_value(string $name): string
{
  $value = $_POST[$name] ?? '';
  if (is_array($value)) {
    reject(400, 'invalid_field', 'Некорректные данные формы.');
  }

  $value = str_replace(["\r\n", "\r"], "\n", (string) $value);
  return trim($value);
}

function utf8_length(string $value): int
{
  return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function validate_phone(string $phone): bool
{
  if (!preg_match('/^[0-9+\s().-]+$/u', $phone)) {
    return false;
  }

  $digits = preg_replace('/\D+/', '', $phone);
  $length = strlen((string) $digits);
  return $length >= 10 && $length <= 15;
}

function validate_post_fields(array $definition): array
{
  $allowed = array_flip($definition['allowed']);
  foreach (array_keys($_POST) as $field) {
    if (!isset($allowed[$field])) {
      reject(400, 'unexpected_field', 'Форма содержит неподдерживаемые поля.');
    }
  }

  if (field_value('website') !== '') {
    reject(400, 'spam_detected', 'Заявка не принята.');
  }

  if (field_value('privacy_consent') !== 'accepted') {
    reject(400, 'privacy_required', 'Необходимо согласие на обработку персональных данных.');
  }

  $data = [];
  foreach ($definition['lengths'] as $field => $maxLength) {
    $value = field_value($field);
    if (utf8_length($value) > $maxLength) {
      reject(422, 'field_too_long', 'Одно из полей превышает допустимую длину.');
    }
    $data[$field] = $value;
  }

  foreach ($definition['required'] as $field) {
    if ($field === 'photo') {
      continue;
    }
    if (($data[$field] ?? field_value($field)) === '') {
      reject(422, 'required_field', 'Заполните все обязательные поля.');
    }
  }

  if (isset($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    reject(422, 'invalid_email', 'Укажите корректный email.');
  }

  if (isset($data['phone']) && !validate_phone($data['phone'])) {
    reject(422, 'invalid_phone', 'Укажите корректный телефон.');
  }

  if (($data['procedure'] ?? '') !== 'Другое') {
    $data['procedure_other'] = '';
  } elseif (($data['procedure_other'] ?? '') === '') {
    reject(422, 'required_field', 'Укажите процедуру.');
  }

  $data['privacy_consent'] = 'accepted';
  return $data;
}

function validate_uploaded_files(array $definition): array
{
  $expectedFiles = $definition['files'];
  $expected = array_flip($expectedFiles);

  if (in_array('photo', $expectedFiles, true)) {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (!is_string($contentType) || stripos($contentType, 'multipart/form-data') === false) {
      reject(415, 'invalid_content_type', 'Форма с файлом должна отправляться как multipart/form-data.');
    }
  }

  foreach (array_keys($_FILES) as $field) {
    if (!isset($expected[$field])) {
      reject(400, 'unexpected_file', 'Форма содержит неподдерживаемые файлы.');
    }
  }

  if (!in_array('photo', $expectedFiles, true)) {
    return [];
  }

  if (!isset($_FILES['photo']) || !is_array($_FILES['photo'])) {
    reject(422, 'required_file', 'Добавьте файл.');
  }

  $file = $_FILES['photo'];
  foreach (['name', 'type', 'tmp_name', 'error', 'size'] as $key) {
    if (is_array($file[$key] ?? null)) {
      reject(400, 'too_many_files', 'Можно прикрепить только один файл.');
    }
  }

  if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    reject(400, 'upload_error', 'Не удалось получить файл.');
  }

  if (($file['size'] ?? 0) <= 0 || ($file['size'] ?? 0) > MAX_REVIEW_FILE_SIZE) {
    reject(400, 'file_too_large', 'Файл должен быть не больше 5 МБ.');
  }

  $tmpName = (string) ($file['tmp_name'] ?? '');
  if ($tmpName === '' || !is_uploaded_file($tmpName)) {
    reject(400, 'upload_error', 'Не удалось получить файл.');
  }

  $finfo = new finfo(FILEINFO_MIME_TYPE);
  $mime = $finfo->file($tmpName) ?: '';
  $allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
  if (!in_array($mime, $allowedMime, true)) {
    reject(400, 'invalid_file_type', 'Допустимы только JPEG, PNG или WebP.');
  }

  return [
    'photo' => [
      'name' => basename((string) ($file['name'] ?? 'photo')),
      'mime' => $mime,
      'size' => (int) $file['size'],
      'tmp_name' => $tmpName,
      'hash' => hash_file('sha256', $tmpName) ?: '',
    ],
  ];
}

function rate_storage_path(): string
{
  $dir = __DIR__ . '/storage/form-rate-limit';
  if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
    reject(500, 'storage_error', 'Временная ошибка формы.');
  }

  return $dir . '/state.json';
}

function read_rate_state($handle): array
{
  rewind($handle);
  $raw = stream_get_contents($handle);
  if (!is_string($raw) || trim($raw) === '') {
    return ['rate' => [], 'duplicates' => []];
  }

  $state = json_decode($raw, true);
  return is_array($state) ? array_merge(['rate' => [], 'duplicates' => []], $state) : ['rate' => [], 'duplicates' => []];
}

function write_rate_state($handle, array $state): void
{
  ftruncate($handle, 0);
  rewind($handle);
  fwrite($handle, json_encode($state, JSON_UNESCAPED_SLASHES));
  fflush($handle);
}

function enforce_rate_limit(string $submissionHash): void
{
  $path = rate_storage_path();
  $handle = fopen($path, 'c+');
  if ($handle === false) {
    reject(500, 'storage_error', 'Временная ошибка формы.');
  }

  try {
    if (!flock($handle, LOCK_EX)) {
      reject(500, 'storage_error', 'Временная ошибка формы.');
    }

    $now = time();
    $ipHash = hashed_ip();
    $state = read_rate_state($handle);
    $rate = is_array($state['rate'] ?? null) ? $state['rate'] : [];
    $duplicates = is_array($state['duplicates'] ?? null) ? $state['duplicates'] : [];

    foreach ($rate as $hash => $timestamps) {
      $timestamps = is_array($timestamps)
        ? array_filter($timestamps, static function ($time) use ($now) {
          return is_int($time) && $time > $now - RATE_LIMIT_WINDOW;
        })
        : [];
      if ($timestamps) {
        $rate[$hash] = array_values($timestamps);
      } else {
        unset($rate[$hash]);
      }
    }

    foreach ($duplicates as $hash => $timestamp) {
      if (!is_int($timestamp) || $timestamp <= $now - DUPLICATE_WINDOW) {
        unset($duplicates[$hash]);
      }
    }

    $current = $rate[$ipHash] ?? [];
    if (count($current) >= RATE_LIMIT_MAX) {
      write_rate_state($handle, ['rate' => $rate, 'duplicates' => $duplicates]);
      reject(429, 'rate_limited', 'Слишком много отправок. Попробуйте позже.');
    }

    if (isset($duplicates[$submissionHash])) {
      write_rate_state($handle, ['rate' => $rate, 'duplicates' => $duplicates]);
      reject(409, 'duplicate_submission', 'Такая заявка уже была отправлена недавно.');
    }

    $current[] = $now;
    $rate[$ipHash] = $current;
    write_rate_state($handle, ['rate' => $rate, 'duplicates' => $duplicates]);
  } finally {
    flock($handle, LOCK_UN);
    fclose($handle);
  }
}

function remember_submission_hash(string $submissionHash): void
{
  $path = rate_storage_path();
  $handle = fopen($path, 'c+');
  if ($handle === false) {
    return;
  }

  try {
    if (!flock($handle, LOCK_EX)) {
      return;
    }

    $now = time();
    $state = read_rate_state($handle);
    $duplicates = is_array($state['duplicates'] ?? null) ? $state['duplicates'] : [];
    foreach ($duplicates as $hash => $timestamp) {
      if (!is_int($timestamp) || $timestamp <= $now - DUPLICATE_WINDOW) {
        unset($duplicates[$hash]);
      }
    }

    $duplicates[$submissionHash] = $now;
    $state['duplicates'] = $duplicates;
    write_rate_state($handle, $state);
  } finally {
    flock($handle, LOCK_UN);
    fclose($handle);
  }
}

function submission_hash(string $formType, array $data, array $files): string
{
  $hashData = [
    'form_type' => $formType,
    'data' => $data,
    'files' => array_map(static fn($file) => [
      'name' => $file['name'] ?? '',
      'mime' => $file['mime'] ?? '',
      'size' => $file['size'] ?? 0,
      'hash' => $file['hash'] ?? '',
    ], $files),
  ];

  return hash('sha256', json_encode($hashData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE));
}

function verify_captcha(array $config): void
{
  if (!($config['captcha']['enabled'] ?? false)) {
    return;
  }

  reject(503, 'captcha_unavailable', 'Проверка CAPTCHA пока не настроена.');
}

function build_email_subject(string $formType): string
{
  $labels = [
    'book' => 'Заявка на консультацию',
    'exo' => 'Заявка со страницы услуги',
    'review' => 'Отзыв пациента',
    'online' => 'Онлайн консультация',
  ];

  return '[cmf-surgery.ru] ' . ($labels[$formType] ?? 'Форма сайта');
}

function form_title(string $formType): string
{
  $labels = [
    'book' => 'Заявка на консультацию',
    'exo' => 'Заявка со страницы услуги',
    'review' => 'Отзыв пациента',
    'online' => 'Онлайн консультация',
  ];

  return $labels[$formType] ?? 'Форма сайта';
}

function email_fields(string $formType, array $data): array
{
  $fields = [
    'Название формы' => form_title($formType),
    'Дата и время' => date('d.m.Y H:i:s'),
    'Имя' => $data['name'] ?? '',
    'Телефон' => $data['phone'] ?? '',
  ];

  if ($formType === 'book') {
    $fields['Услуга'] = $data['service'] ?? '';
    $fields['Комментарий'] = $data['comment'] ?? '';
  } elseif ($formType === 'review') {
    $procedure = $data['procedure'] ?? '';
    if ($procedure === 'Другое' && ($data['procedure_other'] ?? '') !== '') {
      $procedure .= ': ' . $data['procedure_other'];
    }
    $fields['Email'] = $data['email'] ?? '';
    $fields['Процедура'] = $procedure;
    $fields['Сообщение'] = $data['message'] ?? '';
  } else {
    $fields['Комментарий'] = $data['comment'] ?? '';
  }

  return array_filter($fields, static function ($value) {
    return $value !== '';
  });
}

function html_escape(string $value): string
{
  return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function build_email_text(string $formType, array $data): string
{
  $lines = [];
  foreach (email_fields($formType, $data) as $label => $value) {
    $lines[] = $label . ': ' . $value;
  }

  return implode("\n", $lines);
}

function build_email_html(string $formType, array $data): string
{
  $rows = '';
  foreach (email_fields($formType, $data) as $label => $value) {
    $rows .= '<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f8fafc;">' . html_escape($label) . '</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">' . nl2br(html_escape($value), false) . '</td></tr>';
  }

  return '<!doctype html><html><head><meta charset="UTF-8"></head><body><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#111827;">' . $rows . '</table></body></html>';
}

function send_form_email(array $config, string $formType, array $data, array $files): array
{
  $smtp = $config['smtp'] ?? [];
  if (!($smtp['enabled'] ?? false)) {
    return [false, 'temporary_unavailable'];
  }

  $mailerClass = 'PHPMailer\\PHPMailer\\PHPMailer';
  if (!class_exists($mailerClass)) {
    return [false, 'send_failed'];
  }

  try {
    $username = (string) ($smtp['username'] ?? '');
    $password = (string) ($smtp['password'] ?? '');
    if ($username === '' || $password === '') {
      return [false, 'send_failed'];
    }

    $mail = new $mailerClass(true);
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host = (string) ($smtp['host'] ?? '');
    $mail->Port = (int) ($smtp['port'] ?? 465);
    $mail->SMTPAuth = true;
    $mail->Username = $username;
    $mail->Password = $password;
    $mail->SMTPSecure = (string) ($smtp['encryption'] ?? 'ssl');
    $mail->setFrom($username, (string) ($smtp['from_name'] ?? 'Center of Surgery'));

    if ($formType === 'review' && isset($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
      $mail->addReplyTo($data['email'], $data['name'] ?? '');
    }

    foreach (($config['recipients'] ?? []) as $recipient) {
      if (filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        $mail->addAddress($recipient);
      }
    }

    if (count($mail->getToAddresses()) === 0) {
      return [false, 'send_failed'];
    }

    $mail->Subject = build_email_subject($formType);
    $mail->isHTML(true);
    $mail->Body = build_email_html($formType, $data);
    $mail->AltBody = build_email_text($formType, $data);

    foreach ($files as $file) {
      if (isset($file['tmp_name'], $file['name']) && is_uploaded_file((string) $file['tmp_name'])) {
        $mail->addAttachment((string) $file['tmp_name'], (string) $file['name'], 'base64', (string) ($file['mime'] ?? 'application/octet-stream'));
      }
    }

    $mail->send();
    return [true, null];
  } catch (Throwable $exception) {
    return [false, 'send_failed'];
  }
}

try {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    reject(405, 'method_not_allowed', 'Метод не поддерживается.');
  }

  $definitions = form_definitions();
  $formType = field_value('form_type');
  if (!isset($definitions[$formType])) {
    reject(400, 'invalid_form_type', 'Неизвестный тип формы.');
  }

  $definition = $definitions[$formType];
  $data = validate_post_fields($definition);
  $files = validate_uploaded_files($definition);
  $config = load_form_config();
  verify_captcha($config);

  $submissionHash = submission_hash($formType, $data, $files);
  enforce_rate_limit($submissionHash);

  [$sent, $mailError] = send_form_email($config, $formType, $data, $files);
  if (!$sent) {
    reject(503, (string) $mailError, 'Отправка формы временно недоступна. Попробуйте позже или свяжитесь с клиникой по телефону.');
  }

  remember_submission_hash($submissionHash);

  json_response(200, [
    'ok' => true,
    'message' => 'Заявка отправлена.',
  ]);
} catch (Throwable $exception) {
  reject(500, 'server_error', 'Временная ошибка формы.');
}
