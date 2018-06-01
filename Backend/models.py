import sqlite3 as sql

def register_user(username,password):
    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("INSERT INTO users (username,password) VALUES (?,?)", (username,password))
    con.commit()
    con.close()

def retrieve_users():
	con = sql.connect("db/database.db")
	cur = con.cursor()
	cur.execute("SELECT username, password FROM users")
	users = cur.fetchall()
	con.close()
	return users
