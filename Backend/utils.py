import re

def valid_email_format(email):
    result = re.fullmatch('([a-zA-Z0-9\-%_\+]+(\.[a-zA-Z0-9\-%_\+]+)*)@([a-zA-Z0-9\-]+)\.([a-zA-Z0-9\-]{2,})', email)

    if result == None:
        return False
    elif result.group(0) == email:
        return True
