const CustomError = require('../util/customError');
const request = require('../util/request');

//TODO: K. define ErrorMessage public properties
const makeErrorObj = (error) =>
  new CustomError(error.customMessage || error.message, {
    code: error.code,
    type: error.type,
    detail: error.detail,
    param: error.raw && error.raw.param,
    requestId: error.requestId,
    statusCode: error.statusCode
  });

const doAction = async (action, url, payload) => {
  try {
    return await action(url, payload);
  } catch (err) {
    console.log('doAction error - ', err);
    return null;
  }
};

exports.action = async (req, res, next) => {
  try {
    const errors = Array(0);
    // TODO: K. move maxTries, successLimit into config
    const maxTries = 2,
      successLimit = 0.93;
    const { endpoint, payload } = req.body;

    if (endpoint == null) {
      errors.push('endpoint param is required');
    }

    if (payload == null) {
      errors.push('payload param is required');
    }

    if (errors.length > 0) {
      throw {
        customMessage: 'required params are missed',
        errors
      };
    }

    if (request[endpoint.method] == null) {
      throw new Error('Method not supported');
    }
    //TODO K. move make URL logic to services
    //TODO K. move doAction logic to services

    let success = 0,
      s = [];

    for (let i = 0, l = payload.length; i < l; i++) {
      const { params, body } = payload[i];
      let { url } = endpoint,
        tries = 0,
        result = null,
        requestStatus = 'failed';

      //TODO: K. implement url validation
      Object.keys(params).forEach((key) => {
        url = url.replace(`{${key}}`, params[key]);
      });

      while (result === null && tries !== maxTries) {
        result = await doAction(request[endpoint.method], url, body);
        tries++;
      }

      if (result !== null && tries <= maxTries) {
        success++;
        requestStatus = 'success';
      }

      s.push({ tries, requestStatus, url, body });
    }

    const status =
      success / payload.length < successLimit ? 'failed' : 'success';

    res.status(200).json({
      s,
      status
    });
  } catch (err) {
    console.log(err);
    const message = err.customMessage || 'Failed to batch';
    res.status(400).json(makeErrorObj({ ...err, message }));
  }
};
