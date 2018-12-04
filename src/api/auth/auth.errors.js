function InvalidAPIOption(option) {
  const err = new Error(`The API: '${option}' is not supported`)
  err.code = 404
  return err
}

function NotFoundErr() {
  const err = new Error('Cannot find user in database')
  err.code = 404
  return err
}

function MergeAccError() {
  const err = new Error('There was an error in merging the account')
  err.code = 409
  return err
}

function CreateUserError() {
  const err = new Error('Could not create user')
  err.code = 409
  return err
}

function DuplicateAccount() {
  const err = new Error('There is already an account with that email/id')
  err.code = 409
  return err
}

function HashingErr() {
  const err = new Error('Error hashing password')
  err.code = 404
  return err
}

function UnknownServerError() {
  const err = new Error('Unknown server error')
  err.code = 404
  return err
}

function InvalidLogin() {
  const err = new Error('Invalid Login')
  err.code = 404
  return err
}

function UserNotVerified() {
  const err = new Error('User has not been verified')
  err.code = 404
  return err
}

function MissingToken() {
  const err = new Error('Not Token passed to endpoint')
  err.code = 404
  return err
}

function NotConnectedToMongo() {
  const err = new Error('You called a method before connecting to the database. Use `.connect` before calling a method')
  err.code = 500
  return err
}

function InvalidToken() {
  const err = new Error('Not Token passed to endpoint')
  err.code = 404
  return err
}

function ErrorTestUtil() {
  const err = new Error('should have thrown an error')
  err.code = 404
  return err
}

module.exports = {
  ErrorTestUtil,
  InvalidAPIOption,
  InvalidLogin,
  InvalidToken,
  MissingToken,
  UserNotVerified,
  HashingErr,
  CreateUserError,
  UnknownServerError,
  DuplicateAccount,
  MergeAccError,
  NotConnectedToMongo,
  NotFoundErr,
}
