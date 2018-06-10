import sqlite3 as sql
import werkzeug.security as sec

USER_DB = "db/userdata.db"
HASH_METHOD = 'sha256'

def signin_user(username, password):
    user = check_user(username)

    if len(user) == 0:
        return False

    user = user[0]
    hash_str = '{}${}'.format(HASH_METHOD, user[1])

    if not sec.check_password_hash(hash_str, password):
        return False

    return True

def check_user(username):
    con = sql.connect(USER_DB)
    cur = con.cursor()
    cur.execute("SELECT username, password \
                 FROM users WHERE username = (?)", (username,))
    user = cur.fetchall()
    con.close()

    return user

def register_user(username, password, email):
    if len(check_user(username)) != 0:
        return False

    # Hashing
    hashed_pw = sec.generate_password_hash(password, method=HASH_METHOD)[7:]

    con = sql.connect(USER_DB)
    cur = con.cursor()
    cur.execute("INSERT INTO users \
                (username, email, password) VALUES (?,?,?)", \
                (username, email, hashed_pw))
    con.commit()
    con.close()

    return True

def retrieve_users():
	con = sql.connect(USER_DB)
	cur = con.cursor()
	cur.execute("SELECT username, email FROM users")
	users = cur.fetchall()
	con.close()

	return users

def delete_user(username, password):
    user = check_user(username)

    if len(user) == 0:
        return False

    user = user[0]
    hash_str = '{}${}'.format(HASH_METHOD, user[1])

    if not sec.check_password_hash(hash_str, password):
        return False
    
    con = sql.connect(USER_DB)
    cur = con.cursor()
    cur.execute("DELETE FROM users WHERE username = (?)", (username,))
    con.commit()
    con.close()

    return True

def modify_user(username, password, new_password):
    user = check_user(username)

    if len(user) == 0:
        return False

    user = user[0]
    print(user)
    hash_str = '{}${}'.format(HASH_METHOD, user[1])

    if not sec.check_password_hash(hash_str, password):
        print('wrong password')
        return False

    # Hashing
    hashed_pw = sec.generate_password_hash(new_password, method=HASH_METHOD)[7:]

    con = sql.connect(USER_DB)
    cur = con.cursor()
    cur.execute("UPDATE users SET password = ? \
                 WHERE username = ?", (hashed_pw, username))
    con.commit()
    con.close()

    return True
