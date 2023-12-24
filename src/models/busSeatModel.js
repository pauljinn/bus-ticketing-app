class BusSeat {
  constructor(seatNumber, status = "open", passengerId = null) {
    console.log("Bus Seat Model Constructor");
    this._seatNumber = seatNumber;
    this._status = status;
    this._passengerId = passengerId;
  }

  // Getter for seat number
  get seatNumber() {
    return this._seatNumber;
  }

  // Getter and setter for seat status
  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
  }

  // Getter and setter for passenger name
  get passengerId() {
    return this._passengerId;
  }

  // Getter for seat availability
  get isAvailable() {
    return this._status === "open";
  }

  // Method to create a BusSeat instance from a database row
  static fromDatabaseRow(row) {
    const { seat_number, status, passenger_id } = row;
    return new BusSeat(seat_number, status, passenger_id);
  }

  // Method to convert a BusSeat instance to a database row object
  toDatabaseRow() {
    return {
      seat_number: this._seatNumber,
      status: this._status,
      passenger_id: this._passengerId,
    };
  }
}

module.exports = BusSeat;
