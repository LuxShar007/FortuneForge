def calculate_percent(income, invested):

    if income == 0:
        return 0

    return round(
        (invested / income) * 100,
        2
    )


def calculate_xp(percent):

    return int(percent * 10)


def calculate_level(xp):

    return (xp // 100) + 1