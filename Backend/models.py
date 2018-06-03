import sqlite3 as sql

def check_user(username):
    con = sql.connect("db/database.db")
    cur = con.cursor()
    cur.execute("SELECT * FROM users WHERE username = (?)", (username,))
    user = cur.fetchall()
    con.close()

    return user

def register_user(username, password):
    if len(check_user(username)) != 0:
        return False

    con = sql.connect("db/database.db")
    cur = con.cursor()
    cur.execute("INSERT INTO users (username,password) VALUES (?,?)", (username,password))
    con.commit()
    con.close()

    return True

def retrieve_users():
	con = sql.connect("db/database.db")
	cur = con.cursor()
	cur.execute("SELECT username, password FROM users")
	users = cur.fetchall()
	con.close()

	return users

def delete_user(username, password):
    if len(check_user(username)) == 0:
        return False

    con = sql.connect("db/database.db")
    cur = con.cursor()
    cur.execute("DELETE FROM users WHERE username = ? AND password = ?", (username,password))
    con.commit()
    con.close()

    return True

def modify_user(username, password, new_password):
    if len(check_user(username)) == 0:
        return False

    con = sql.connect("db/database.db")
    cur = con.cursor()
    cur.execute("UPDATE users SET password = ? WHERE username = ? AND password = ?", (new_password, username, password))
    con.commit()
    con.close()

    return True
