const express = require("express");
const TicketController = require("../controllers/ticketController.js");
const router = express.Router();

const ticketController = new TicketController();

router.get("/ticket/:seatNumber", ticketController.getTicketStatus);
router.put("/ticket/:seatNumber", ticketController.updateTicketStatus);
router.get("/tickets/open", ticketController.getAllOpenTickets);
router.get("/tickets/closed", ticketController.getAllClosedTickets);
router.get("/ticket/owner/:seatNumber", ticketController.getTicketOwnerDetails);
router.post("/admin/reset", ticketController.resetServer);

module.exports = router;
