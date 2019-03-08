#!/bin/bash
mysql --user=$MYSQL_USER --password=$MYSQL_PASSWORD $MYSQL_DATABASE << EOF
INSERT INTO \`clock_of_change\`.\`apikeys\` (\`secret\`, \`valid\`, \`expire_at\`, \`created_at\`, \`updated_at\`) VALUES ('secret', '1', 1893456001, 1552060594, 1552060594);
INSERT INTO \`clock_of_change\`.\`entries\` (\`email\`, \`firstname\`, \`lastname\`, \`message\`, \`country\`, \`image\`, \`email_confirmed\`, \`confirm_key\`, \`status\`, \`created_at\`, \`updated_at\`, \`confirmed_at\`, \`newsletter\`, \`pax\`) VALUES ('pamela@example.org', 'Pamela', 'Musterfrau', 'Let us change the world!', 'US', '', '1', 'confirm', '1', '1552060594', '1552060594', '1552060594', '1', '1');
INSERT INTO \`clock_of_change\`.\`entries\` (\`email\`, \`firstname\`, \`lastname\`, \`message\`, \`country\`, \`image\`, \`email_confirmed\`, \`confirm_key\`, \`status\`, \`created_at\`, \`updated_at\`, \`confirmed_at\`, \`newsletter\`, \`pax\`) VALUES ('max@example.org', 'Max', 'Mustermann', 'Lasst uns die Welt verbessern!', 'DE', '', '1', 'confirm', '1', '1552060594', '1552060594', '1552060594', '0', '1');
EOF
