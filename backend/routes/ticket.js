import Ticket from './models/Ticket';

const bookTicket = async (ticketData, user) => {
  try {
   
     const ticket = new Ticket({
      startStation: ticketData.startStation,
      endStation: ticketData.endStation,
      date: ticketData.date,
     
      user: user._id, 
    });

    const savedTicket = await ticket.save();

  
    return { message: 'Ticket booked successfully', ticket: savedTicket };
  } catch (error) {
    console.error(error);
    throw new Error('Error booking ticket');
  }
};

export default {
    bookTicket,
    
};    
