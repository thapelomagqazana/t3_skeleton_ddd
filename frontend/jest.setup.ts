import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
