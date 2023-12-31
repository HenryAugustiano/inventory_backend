const request = require('supertest');
const app = require('../index'); 
const User = require('../models/User'); 
const bcrypt = require('bcrypt');

const testEmail = 'jest@gmail.com';
const testPassword = 'jest123';

describe('User Registration', () => {
  it('should register a new user', async () => {
    const userData = {
      email: testEmail,
      password: testPassword,
    };

    // Perform the registration request
    const res = await request(app)
      .post('/api/users/register')
      .send(userData);

    // Expect a successful response
    console.log(res.body);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');

    // Check if the user is saved in the database
    const savedUser = await User.findOne({ email: userData.email });
    expect(savedUser).toBeTruthy();

    // Check if the password is hashed correctly
    const passwordMatch = await bcrypt.compare(userData.password, savedUser.password);
    expect(passwordMatch).toBe(true);

  });

  it('should return an error if the user already exists', async () => {

    const userData = {
      email: testEmail,
      password: testPassword,
    };

    // Perform the registration request
    const res = await request(app)
      .post('/api/users/register')
      .send(userData);

    // Expect a duplicate user error response
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });
});

describe('User Delete', () => {
  it('should delete a user', async () => {
    const userData = {
      email: testEmail,
    };

    // Perform the registration request
    const res = await request(app)
      .delete('/api/users/delete')
      .send(userData);

    // Expect a successful response
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');

    // Check if the user is deleted from the database
    const savedUser = await User.findOne({ email: userData.email });
    expect(savedUser).toBeFalsy();
  });
});
