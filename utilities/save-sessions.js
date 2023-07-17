function getSessionData(req) {
  let sessionData = req.session.flashedData;
  req.session.flashedData = null;
  return sessionData;
}

function saveDataInSession(req,data,action) {
    req.session.flashedData = data;
    req.session.save(action);
}

module.exports = {
  getSessionData: getSessionData,
  saveDataInSession: saveDataInSession,
};
