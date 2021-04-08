import { ethers } from 'hardhat'
import { base64Encode } from './shared/base64encode'
import { expect } from './shared/expect'
import { Base64Test } from '../typechain'
import { randomBytes } from 'crypto'
import snapshotGasCost from './shared/snapshotGasCost'

function stringToHex(str: string): string {
  return `0x${Buffer.from(str, 'utf8').toString('hex')}`
}

describe('Base64', () => {
  let base64: Base64Test
  before('deploy test contract', async () => {
    base64 = (await (await ethers.getContractFactory('Base64Test')).deploy()) as Base64Test
  })

  describe('#encode', () => {
    it('is correct for empty bytes', async () => {
      expect(await base64.encode(stringToHex(''))).to.eq('')
    })

    for (const example of [
      'test string',
      'this is a test',
      'alphabet soup',
      'aLpHaBeT',
      'includes\nnewlines',
      '<some html>',
      '😀',
      'f',
      'fo',
      'foo',
      'foob',
      'fooba',
      'foobar',
      'this is a very long string that should cost a lot of gas to encode :)',
    ]) {
      it(`works for "${example}"`, async () => {
        expect(await base64.encode(stringToHex(example))).to.eq(base64Encode(example))
      })

      it(`gas cost of encode(${example})`, async () => {
        await snapshotGasCost(base64.getGasCostOfEncode(stringToHex(example)))
      })
    }

    it('tiny fuzzing', async () => {
      const inputs = []
      for (let i = 0; i < 100; i++) {
        inputs.push(randomBytes(Math.random() * 100))
      }

      const promises = inputs.map((input) => {
        return base64.encode(`0x${input.toString('hex')}`)
      })

      const results = await Promise.all(promises)

      for (let i = 0; i < inputs.length; i++) {
        expect(inputs[i].toString('base64')).to.eq(results[i])
      }
    }).timeout(300_000)
  })
})
