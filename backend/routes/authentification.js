import passport from "passport";

const requireAuth = passport.authenticate('jwt', { session: false });

const requireAdmin = (req, res, next) => {
    // Check if the user is an admin (customize this based on your user model)
    if (req.user && req.user.role === 'admin') {
      return next();
    } else {
      return res.status(403).send('Permission denied. Admins only.');
    }
};
  
export default {requireAdmin, requireAuth};