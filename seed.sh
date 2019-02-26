#!/bin/bash
mysql --user=$MYSQL_USER --password=$MYSQL_PASSWORD $MYSQL_DATABASE << EOF
INSERT INTO \`clock_of_change\`.\`apikeys\` (\`secret\`, \`valid\`) VALUES ('secret', '1');
INSERT INTO \`clock_of_change\`.\`entries\` (\`firstname\`, \`lastname\`, \`email\`, \`country\`, \`message\`, \`confirm_key\`, \`beta\`, \`newsletter\`, \`pax\`, \`email_confirmed\`, \`status\`) VALUES ('Pamela', 'Musterfrau', 'pamela@example.org', 'US', 'Let us change the world!', 'confirm', '1', '0', '1', '1', '1');
INSERT INTO \`clock_of_change\`.\`entries\` (\`firstname\`, \`lastname\`, \`email\`, \`country\`, \`message\`, \`confirm_key\`, \`beta\`, \`newsletter\`, \`pax\`, \`email_confirmed\`, \`status\`) VALUES ('Max', 'Mustermann', 'max@mustermann.de', 'DE', 'Lasst uns die Welt verbessern!', 'confirm', '0', '1', '1', '1', '1');
EOF
