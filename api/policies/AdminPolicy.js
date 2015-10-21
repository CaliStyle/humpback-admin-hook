/**
 * AdminPolicy
 *
 * @module      :: Policy
 * @description :: Simple policy that only allows users with Admin Role into Back Admin
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

module.exports = function(req, res, next) {
  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if(!req.user){
  	req.logout();
  	return res.redirect('/admin');
  }
  else{
  	User.findOne(req.user.id)
  	.populate('roles')
  	.then(function(user){
  		var admin = _.some(user.roles, function (userRole) {
          	return userRole.name === 'admin';
        });

        if(!admin){
            throw new Error(user.username,'does not have sufficient privileges');
        }else{
        	next();
        }
  	})
  	.catch(function(e){
  		sails.log.error(e);
  		return res.redirect('/admin');
  	});

  } 
};