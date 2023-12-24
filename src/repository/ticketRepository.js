const getDatabasePool = require("../database/db.js");

class TicketRepository {
  constructor() {
    // Get the database pool instance
    this.pool = getDatabasePool();
  }

  async updateTicketStatus(busSeat, passenger) {
    const client = await this.pool.connect();
    try {
      // Start a transaction
      await client.query("BEGIN");

      // Update ticket status
      let updateResult = await client.query(
        "UPDATE bus_seats SET status = $1 WHERE seat_number = $2 RETURNING *",
        [busSeat.status, busSeat.seatNumber]
      );

      // If closing the ticket, add passenger details
      if (busSeat.status === "closed" && passenger.passengerName) {
        const insertedPassenger = await client.query(
          "INSERT INTO passengers (name, seat_number) VALUES ($1, $2) RETURNING *",
          [passenger.passengerName, busSeat.seatNumber]
        );
        console.log("Inserted passenger ", insertedPassenger.rows[0].id);
        updateResult = await client.query(
          "UPDATE bus_seats SET passenger_id = $1 where seat_number = $2 RETURNING *",
          [insertedPassenger.rows[0].id, busSeat.seatNumber]
        );
      }

      // Commit the transaction
      await client.query("COMMIT");
      return updateResult;
    } catch (error) {
      // If an error occurs, roll back the transaction
      await client.query("ROLLBACK");
      throw error;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }

  async getTicketStatus(seatNumber) {
    const result = await this.pool.query(
      "SELECT status FROM bus_seats WHERE seat_number = $1",
      [seatNumber]
    );

    return result.rows[0] ? result.rows[0].status : null;
  }

  async getAllClosedTickets() {
    const result = await this.pool.query(
      "SELECT * FROM bus_seats WHERE status = 'closed'"
    );

    return result.rows;
  }

  async getAllOpenTickets() {
    const result = await this.pool.query(
      "SELECT * FROM bus_seats WHERE status = 'open'"
    );

    return result.rows;
  }

  async getTicketOwnerDetails(seatNumber) {
    const result = await this.pool.query(
      "SELECT p.* FROM passengers p INNER JOIN bus_seats b ON p.seat_number = b.seat_number WHERE b.seat_number = $1",
      [seatNumber]
    );

    return result.rows[0];
  }

  async resetServer() {
    const client = await this.pool.connect();
    try {
      // Start a transaction
      await client.query("BEGIN");

      // Reset all tickets to open status
      const resetTicketsResult = await client.query(
        "UPDATE bus_seats SET status = 'open',passenger_id=null "
      );

      // Delete all passenger records
      await client.query("DELETE FROM passengers");

      // Commit the transaction
      await client.query("COMMIT");

      // Check if the server reset was successful
      return resetTicketsResult.rowCount >= 0; // Always true, as rowCount is the number of affected rows (may be 0)
    } catch (error) {
      // If an error occurs, roll back the transaction
      await client.query("ROLLBACK");
      throw error;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }
}

module.exports = TicketRepository;
