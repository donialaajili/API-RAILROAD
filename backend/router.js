const express = require('express');
const router = express.Router();
const { requireAuth } = require('./authMiddleware');

// Write endpoints
router.post('/reservation', requireAuth, (req, res) => {
  // Only authenticated users can access this endpoint
  // Logique pour traiter la réservation
  res.json({ message: 'Billet réservé avec succès' });
});

// Employé vérifiant la validité du billet
router.get('/validate-ticket/:ticketId', requireAuth, (req, res) => {
  // Only authenticated users can access this endpoint
  // Logique pour vérifier la validité du billet
  res.json({ message: 'Billet valide' });
});

module.exports = router;
