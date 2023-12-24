class Passenger {
  constructor(name) {
    this._name = name;
  }

  // Getter and setter for passenger name
  get name() {
    return this._name;
  }

  // Method to create a Passenger instance from a database row
  static fromDatabaseRow(row) {
    const { name } = row;
    return new Passenger(name);
  }

  // Method to convert a Passenger instance to a database row object
  toDatabaseRow() {
    return {
      name: this._name,
    };
  }
}

module.exports = Passenger;
