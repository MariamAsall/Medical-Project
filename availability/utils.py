from datetime import datetime, timedelta, date

def generate_time_slots(selected_date, start_time, end_time, slot_duration_minutes=30):
    """
    Returns a list of datetime objects for each slot on a given date.
    Example: date=2025-06-10, start=13:00, end=21:00, duration=30
    → [datetime(2025-06-10, 13:00), datetime(2025-06-10, 13:30), ...]
    """
    slots = []
    current = datetime.combine(selected_date, start_time)
    end     = datetime.combine(selected_date, end_time)
    delta   = timedelta(minutes=slot_duration_minutes)

    while current + delta <= end:
        slots.append(current)
        current += delta

    return slots