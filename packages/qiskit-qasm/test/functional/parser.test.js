/*
  Copyright IBM Corp. 2017. All Rights Reserved.

  This code may only be used under the Apache 2.0 license found at
  http://www.apache.org/licenses/LICENSE-2.0.txt.

  Authors:
  - Jesús Pérez <jesusper@us.ibm.com>
*/

'use strict';

const assert = require('assert');
// const util = require('util');

const qasm = require('../..');
const pkgInfo = require('../../package');
const Parser = require('../../lib/Parser');

let parser;

describe('qasm:version', () =>
  it('should return the package version', () => assert.equal(qasm.version, pkgInfo.version)));


describe('qasm:parse', () => {
  // TODO: Implement
  it('should fail without param', () => {
    parser = new Parser();
    assert.throws(
      () => { parser.parse(); },
      // eslint-disable-next-line comma-dangle
      /Required param: circuit/
    );
  });

  // const expected = [
  //   { type: 'qubit', identifier: 'q', number: '5' },
  //   { type: 'clbit', identifier: 'c', number: '5' },
  //   { type: 'x', identifiers: [{ name: 'q', index: '0' }] },
  //   { type: 'measure', qreg: { name: 'q' }, creg: { name: 'c' } },
  // ];
  // const expected = [
  //   { type: 'qubit', identifier: 'q', number: '1' },
  //   { type: 'clbit', identifier: 'c', number: '1' },
  //   { type: 'measure', qreg: { name: 'q' }, creg: { name: 'c' } },
  // ];
  const circuitSimple = 'qreg q[1];\n' +
                        'creg c[1];\n' +
                        'measure q->c;\n';

  // TODO: Review the spec. (v2 mandatory OPENQASM 2.0)
  it('should work with "IBMQASM 2.0" as version header', () => {
    parser = new Parser();
    const circuit = `IBMQASM 2.0;\n${circuitSimple}`;

    expect(parser.parse(circuit)).toMatchSnapshot();
  });

  it('should work with with "OPENQASM 2.0" as version header', () => {
    parser = new Parser();
    const circuit = `OPENQASM 2.0;\n${circuitSimple}`;

    expect(parser.parse(circuit)).toMatchSnapshot();
  });

  it('should fail with any other version header', () => {
    parser = new Parser();
    const circuit = 'A 2.0;\n';
    // TODO: More cases
    // const circuit = 'OPENQASM 1.0;\n';
    // const circuit = 'A 1.0;\n';
    // const circuit = 'A';

    // TODO: Not working.
    // assert.throws(
    //   () => { parse(circuit); },
    //   // eslint-disable-next-line comma-dangle
    //   /Lexical error on line 1: Unrecognized text/
    // );
    assert.throws(() => { parser.parse(circuit); });
  });

  it('should fail with no version header', () => {
    parser = new Parser();
    const circuit = 'qreg q[5];\n' +
                    'creg c[5];\n' +
                    'x q[0];\n' +
                    'measure q -> c;';

    // TODO: Not working.
    // assert.throws(
    //   () => { parse(circuit); },
    //   // eslint-disable-next-line comma-dangle
    //   /Lexical error on line 1: Unrecognized text/
    // );
    assert.throws(() => { parser.parse(circuit); });
  });

  // TODO: Not working.
  it('should work with "include"', () => {
    parser = new Parser();
    const circuit = 'OPENQASM 2.0;\n' +
                    'include "qelib1.inc";\n' +
                    'qreg q[5];\n' +
                    'creg c[5];\n' +
                    'x q[0];\n' +
                    'measure q -> c;';

    expect(parser.parse(circuit)).toMatchSnapshot();
  });

  it('should work with RESET', () => {
    parser = new Parser();
    const circuit = 'IBMQASM 2.0;\n' +
                    'qreg q[1];\n' +
                    'creg c[1];\n' +
                    'reset q[0];';

    expect(parser.parse(circuit)).toMatchSnapshot();
  });

  // TODO: Should fail (qreg invalid)
  it('should fail with "include"', () => {
    parser = new Parser();
    const circuit = 'OPENQASM 2.0;\n' +
                    'qreg q[1];\n' +
                    'creg c[1];\n' +
                    'x q[1];\n';

    expect(parser.parse(circuit)).toMatchSnapshot();
  });

  it('should work with OPAQUE gate (1)', () => {
    parser = new Parser();
    const circuit = 'OPENQASM 2.0;\n' +
                    'qreg q[1];\n' +
                    'creg c[1];\n' +
                    'opaque myOpaque a,b,c;';

    expect(parser.parse(circuit)).toMatchSnapshot();
  });


  it('should work with OPAQUE gate (2)', () => {
    parser = new Parser();
    const circuit = 'OPENQASM 2.0;\n' +
                    'qreg q[1];\n' +
                    'creg c[1];\n' +
                    'opaque myOpaque () a,b,c;';

    expect(parser.parse(circuit)).toMatchSnapshot();
  });

  it('should work with OPAQUE gate (3)', () => {
    parser = new Parser();
    const circuit = 'OPENQASM 2.0;\n' +
                    'qreg q[1];\n' +
                    'creg c[1];\n' +
                    'opaque myOpaque (x,y) a,b,c;';

    expect(parser.parse(circuit)).toMatchSnapshot();
  });
});
