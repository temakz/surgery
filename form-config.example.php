<?php

defined('FORM_HANDLER') || exit;

return [
  'smtp' => [
    'enabled' => false,
    'host' => 'smtp.timeweb.ru',
    'port' => 465,
    'username' => 'forms@cmf-surgery.ru',
    'password' => '',
    'encryption' => 'ssl',
    'from_email' => 'forms@cmf-surgery.ru',
    'from_name' => 'Center of Surgery',
  ],
  'recipients' => [
    'surgery79@mail.ru',
    'temakz@proton.me',
  ],
  'captcha' => [
    'enabled' => false,
    'server_key' => '',
  ],
];
