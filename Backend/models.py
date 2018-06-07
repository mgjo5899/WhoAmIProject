import sqlite3 as sql
import werkzeug.security as sec

USER_DB = "db/userdata.db"

def check_user(username):
    con = sql.connect(USER_DB)
    cur = con.cursor()
    cur.execute("SELECT username, password_salt, password_hash \
                 FROM users WHERE username = (?)", (username,))
    user = cur.fetchall()
    con.close()

    return user

def register_user(username, password, email):
    if len(check_user(username)) != 0:
        return False

    # Hashing
    rtn_str = sec.generate_password_hash(password, method='sha256')[7:]
    password_salt = rtn_str[:rtn_str.find('$')]
    password_hash = rtn_str[rtn_str.find('$') + 1:]

    con = sql.connect(USER_DB)
    cur = con.cursor()
    cur.execute("INSERT INTO users \
                (username, email, password_salt, password_hash) VALUES (?,?,?,?)", \
                (username, email, password_salt, password_hash))
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
    hash_str = 'sha256$' + user[1] + '$' + user[2]

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
    hash_str = 'sha256$' + user[1] + '$' + user[2]

    if not sec.check_password_hash(hash_str, password):
        print('wrong password')
        return False

    # Hashing
    rtn_str = sec.generate_password_hash(new_password, method='sha256')[7:]
    password_salt = rtn_str[:rtn_str.find('$')]
    password_hash = rtn_str[rtn_str.find('$') + 1:]

    con = sql.connect(USER_DB)
    cur = con.cursor()
    cur.execute("UPDATE users SET password_salt = ?, password_hash = ? \
                 WHERE username = ?", (password_salt, password_hash, username))
    con.commit()
    con.close()

    return True
