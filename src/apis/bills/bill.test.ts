import { getBillsOfUserFromDB, testy } from "./bill.api";

  describe('E2E test', () => {
    // beforeEach(async () => {
    //   // await Promise.all(browsers.map(browser => browser.close()));

    //   // browsers = [];
    // });

    // afterEach(async () => {
    //   // await Promise.all(browsers.map(browser => browser.close()));
    // });

    it('should be able to launch three browsers simultaneously', async () => {

      const bills = await getBillsOfUserFromDB('amddev')
      console.info("BILLS", bills)
      expect(testy()).toBe("cv")

    },330000)
  })


