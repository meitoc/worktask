const User = require("../models/User.js")
const Access = require("../models/Access.js")

const isAuthenticated = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if(!bearerToken || typeof bearerToken !== 'string') return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
    const session = bearerToken.substring(7);
    const accessFound = await Access.findOne({session,active:true})
    if(!accessFound)  return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
    const role = await accessFound.isValidSession(session);
    if(!role) return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
    req.access={userId: accessFound.user.toString() ,role};
    next();
};

const isAdminAuthenticated = async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if(!bearerToken || typeof bearerToken !== 'string') return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
    const session = bearerToken.substring(7);
    const accessFound = await Access.findOne({session,active:true})
    if(!accessFound)  return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
    const role = await accessFound.isValidSession(session);
    if(role==="admin") next();
    else return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
};
const isUserAuthenticated = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if(!bearerToken || typeof bearerToken !== 'string') return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
  const session = bearerToken.substring(7);
  const accessFound = await Access.findOne({session,active:true})
  if(!accessFound)  return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
  const role = await accessFound.isValidSession(session);
  if(role==="user") next();
  else return res.status(401).json({ errors: [{ message: 'Invalid token!' }] });
};
    module.exports = { isAuthenticated, isAdminAuthenticated,isUserAuthenticated };