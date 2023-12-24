const BusSeat = require("../models/busSeatModel.js");
const Passenger = require("../models/passengersModel.js");

const TicketRepository = require("../repository/ticketRepository.js");

class TicketService {
  constructor() {
    // Create an instance of the TicketRepository
    this.ticketRepository = new TicketRepository();
  }

  async updateTicketStatus(busSeat, passenger) {
    try {
      // Call the repository to update the ticket status
      const updateResultRow = await this.ticketRepository.updateTicketStatus(
        busSeat,
        passenger
      );

      // Return the updated BusSeat instance in the response
      return BusSeat.fromDatabaseRow(updateResultRow.rows[0]);
    } catch (error) {
      // Handle or log the error
      throw error;
    }
  }

  async getTicketStatus(seatNumber) {
    try {
      // Call the repository to get the ticket status
      const status = await this.ticketRepository.getTicketStatus(seatNumber);

      // Return the result
      return status;
    } catch (error) {
      // Handle or log the error
      throw error;
    }
  }

  async getAllClosedTickets() {
    try {
      // Call the repository to get all closed tickets
      const closedTicketsRows =
        await this.ticketRepository.getAllClosedTickets();

      // Mapping each row to a BusSeat instance
      const closedTickets = closedTicketsRows.map((row) =>
        BusSeat.fromDatabaseRow(row)
      );

      // Return the result
      return closedTickets;
    } catch (error) {
      // Handle or log the error
      throw error;
    }
  }

  async getAllOpenTickets() {
    try {
      // Call the repository to get all open tickets
      const openTicketsRows = await this.ticketRepository.getAllOpenTickets();
      const openTickets = openTicketsRows.map((openTicket) =>
        BusSeat.fromDatabaseRow(openTicket)
      );
      // Return the result
      return openTickets;
    } catch (error) {
      // Handle or log the error
      throw error;
    }
  }

  async getTicketOwnerDetails(seatNumber) {
    try {
      // Call the repository to get ticket owner details
      const ownerDetailsRow = await this.ticketRepository.getTicketOwnerDetails(
        seatNumber
      );
      if (ownerDetailsRow === undefined) {
        return;
      }
      const ownerDetails = Passenger.fromDatabaseRow(ownerDetailsRow);
      // Return the result
      return ownerDetails;
    } catch (error) {
      // Handle or log the error
      throw error;
    }
  }

  async resetServer() {
    try {
      // Call the repository to reset the server
      const resetResult = await this.ticketRepository.resetServer();

      // Return the result
      return resetResult;
    } catch (error) {
      // Handle or log the error
      throw error;
    }
  }
}

module.exports = TicketService;
