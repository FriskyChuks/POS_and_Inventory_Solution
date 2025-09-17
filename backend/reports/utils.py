# reports/utils.py
from datetime import datetime, timedelta
from django.utils.timezone import now

def get_date_range(shortcut=None, start_date=None, end_date=None):
    today = now().date()

    if shortcut == "today":
        return today, today

    elif shortcut == "this_week":
        start = today - timedelta(days=today.weekday())  # Monday
        end = start + timedelta(days=6)
        return start, end

    elif shortcut == "this_month":
        start = today.replace(day=1)
        next_month = (start.replace(day=28) + timedelta(days=4)).replace(day=1)
        end = next_month - timedelta(days=1)
        return start, end

    elif shortcut == "this_quarter":
        quarter = (today.month - 1) // 3 + 1
        start = datetime(today.year, 3 * quarter - 2, 1).date()
        if quarter == 4:
            end = datetime(today.year + 1, 1, 1).date() - timedelta(days=1)
        else:
            end = datetime(today.year, 3 * quarter + 1, 1).date() - timedelta(days=1)
        return start, end

    elif start_date and end_date:
        return start_date, end_date

    return None, None
