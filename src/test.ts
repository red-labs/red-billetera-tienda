
import { subtractTxnCost, formatToDollars, convertToCOP } from "./utils";
import {bigNumberify}from "ethers/utils";
import test from "blue-tape";

test("Format small amount", async t  => {

    const value = bigNumberify("10000")
    console.log(formatToDollars(subtractTxnCost(value)))

});

test("Format COP with subtract txn cost", async t  => {

    let value = bigNumberify("1500000000000000000")
    const rate = bigNumberify("3123")
    console.log('COP', convertToCOP(subtractTxnCost(value), rate))

    value = bigNumberify("1000")
    console.log('COP2', convertToCOP(subtractTxnCost(value), rate))
});
