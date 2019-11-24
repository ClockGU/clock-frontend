#!/bin/bash
set -euo pipefail

# Delete the test user if it exists and recreate it
echo "from api.models import User; u = User.objects.filter(email='cypress@example.com'); u.delete() if len(u) else None; User.objects.create_user(username='cypress', email='cypress@example.com', password='cypress', first_name='Cy', last_name='press', personal_number=123456)" | docker-compose -f /Users/migecht/Code/python/clock-backend/docker-compose.yml run --rm web python manage.py shell
