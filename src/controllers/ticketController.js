const TicketService = require("../services/ticketService.js");
const BusSeat = require("../models/busSeatModel.js");
const Passenger = require("../models/passengersModel.js");

class TicketController {
  constructor() {
    this.ticketService = new TicketService();
    this.getAllOpenTickets = this.getAllOpenTickets.bind(this);
    this.getTicketStatus = this.getTicketStatus.bind(this);
    this.updateTicketStatus = this.updateTicketStatus.bind(this);
    this.getAllClosedTickets = this.getAllClosedTickets.bind(this);
    this.getAllOpenTickets = this.getAllOpenTickets.bind(this);
    this.resetServer = this.resetServer.bind(this);
    this.getTicketOwnerDetails = this.getTicketOwnerDetails.bind(this);
  }

  async getTicketStatus(req, res, next) {
    try {
      // Get seatNumber from request parameters
      const { seatNumber } = req.params;

      // Call the service to get ticket status
      const status = await this.ticketService.getTicketStatus(seatNumber);

      // Return the result
      res.status(200).json({ status });
    } catch (error) {
      // Handle or log the error
      res.status(500).json({ error: "Internal Server Error" });
      // Print the error stack trace on terminal.
      next(error);
    }
  }

  async updateTicketStatus(req, res, next) {
    try {
      // Get seatNumber, status, and passengerName from request body
      const { seatNumber, status, passengerName } = req.body;

      // Create a BusSeat instance
      const busSeat = new BusSeat(seatNumber, status);

      //Create a passenger

      const passenger = new Passenger(passengerName);

      // Call the service to update ticket status
      const updateResult = await this.ticketService.updateTicketStatus(
        busSeat,
        passenger
      );

      // Return the result
      res.status(200).json({ busSeat: updateResult });
    } catch (error) {
      // Handle or log the error
      res.status(500).json({ error: "Internal Server Error" });
      // Print the error stack trace on terminal.
      next(error);
    }
  }

  async getAllOpenTickets(req, res, next) {
    try {
      // Call the service to get all open tickets
      const openTickets = await this?.ticketService?.getAllOpenTickets();

      // Return the result
      res.status(200).json({ openTickets });
    } catch (error) {
      // Handle or log the error
      res.status(500).json({ error: "Internal Server Error" });
      // Print the error stack trace on terminal.
      next(error);
    }
  }

  async getAllClosedTickets(req, res, next) {
    try {
      // Call the service to get all closed tickets
      const closedTickets = await this.ticketService.getAllClosedTickets();

      // Return the result
      res.status(200).json({ closedTickets });
    } catch (error) {
      // Handle or log the error
      res.status(500).json({ error: "Internal Server Error" });
      // Print the error stack trace on terminal.
      next(error);
    }
  }

  async getTicketOwnerDetails(req, res, next) {
    try {
      // Get seatNumber from request parameters
      const { seatNumber } = req.params;

      // Call the service to get ticket owner details
      const ownerDetails = await this.ticketService.getTicketOwnerDetails(
        seatNumber
      );

      // Return the result
      res.status(200).json({ ownerDetails });
    } catch (error) {
      // Handle or log the error
      res.status(500).json({ error: "Internal Server Error" });
      // Print the error stack trace on terminal.
      next(error);
    }
  }

  async resetServer(req, res, next) {
    try {
      const { username, password } = req.body;

      if (username === "admin" && password === "admin#123") {
        // Call the service to reset the server
        const resetResult = await this.ticketService.resetServer();

        // Return the result
        res.status(200).json({ success: resetResult });
      } else {
        res.status(403).json({ error: "Access denied" });
      }
    } catch (error) {
      // Handle or log the error
      res.status(500).json({ error: "Internal Server Error" });
      // Print the error stack trace on terminal.
      next(error);
    }
  }
}

module.exports = TicketController;
