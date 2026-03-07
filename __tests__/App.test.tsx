/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it, jest} from '@jest/globals';

// Mock the navigation before importing App
jest.mock('../src/navigation/AppNavigator', () => {
  return function MockAppNavigator() {
    return null;
  };
});

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});
