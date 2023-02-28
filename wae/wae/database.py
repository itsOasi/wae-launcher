import sqlite3

class Database:
	def __init__(self, database_name):
		self.name = database_name
		self.connection = sqlite3.connect(database_name)
		self.cursor = self.connection.cursor()

	def create_table(self, table_name, fields):
		field_str = ", ".join(f"{name} {datatype}" for name, datatype in fields.items())
		self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} ({field_str})")
		self.connection.commit()

	def insert(self, table_name, data):
		field_str = ", ".join(data.keys())
		placeholder_str = ", ".join("?" for _ in data.values())
		self.cursor.execute(f"INSERT INTO {table_name} ({field_str}) VALUES ({placeholder_str})", tuple(data.values()))
		self.connection.commit()

	def fetch(self, table_name, columns, value_dict=None):
		if value_dict:
			condition = "" # condition string to be created
			col_split = columns.split(", ") # columns to retrieve
			for key, _ in value_dict.items(): # get keys from dict
				i = list(value_dict.keys()).index(key) # key index
			condition += f"{col_split[i]}=:{key} AND " # get column
			condition = condition[:-5]
			self.cursor.execute(f"SELECT {columns} FROM {table_name} WHERE {condition}", value_dict)
			result = self.cursor.fetchall()
			self.cursor.execute(f"SELECT * FROM {table_name} WHERE {condition}", value_dict)
			row = self.cursor.fetchall()
			return (result, row)
		self.cursor.execute(f"SELECT * FROM {table_name}")
		return self.cursor.fetchall()

	def delete(self, table_name, condition):
		self.cursor.execute(f"DELETE FROM {table_name} WHERE {condition}")
		self.connection.commit()

	def close(self):
		self.cursor.close()
		self.connection.close()
