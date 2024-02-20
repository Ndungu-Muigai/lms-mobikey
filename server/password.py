import secrets

def random_password():
    return secrets.token_urlsafe(10)