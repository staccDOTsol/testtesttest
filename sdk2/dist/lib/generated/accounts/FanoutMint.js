"use strict";
/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fanoutMintBeet = exports.FanoutMint = void 0;
const beet = __importStar(require("@metaplex-foundation/beet"));
const beetSolana = __importStar(require("@metaplex-foundation/beet-solana"));
const fanoutMintDiscriminator = [50, 164, 42, 108, 90, 201, 250, 216];
/**
 * Holds the data for the {@link FanoutMint} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
class FanoutMint {
    constructor(mint, fanout, tokenAccount, totalInflow, lastSnapshotAmount, bumpSeed) {
        this.mint = mint;
        this.fanout = fanout;
        this.tokenAccount = tokenAccount;
        this.totalInflow = totalInflow;
        this.lastSnapshotAmount = lastSnapshotAmount;
        this.bumpSeed = bumpSeed;
    }
    /**
     * Creates a {@link FanoutMint} instance from the provided args.
     */
    static fromArgs(args) {
        return new FanoutMint(args.mint, args.fanout, args.tokenAccount, args.totalInflow, args.lastSnapshotAmount, args.bumpSeed);
    }
    /**
     * Deserializes the {@link FanoutMint} from the data of the provided {@link web3.AccountInfo}.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static fromAccountInfo(accountInfo, offset = 0) {
        return FanoutMint.deserialize(accountInfo.data, offset);
    }
    /**
     * Retrieves the account info from the provided address and deserializes
     * the {@link FanoutMint} from its data.
     *
     * @throws Error if no account info is found at the address or if deserialization fails
     */
    static fromAccountAddress(connection, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountInfo = yield connection.getAccountInfo(address);
            if (accountInfo == null) {
                throw new Error(`Unable to find FanoutMint account at ${address}`);
            }
            return FanoutMint.fromAccountInfo(accountInfo, 0)[0];
        });
    }
    /**
     * Deserializes the {@link FanoutMint} from the provided data Buffer.
     * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
     */
    static deserialize(buf, offset = 0) {
        return exports.fanoutMintBeet.deserialize(buf, offset);
    }
    /**
     * Serializes the {@link FanoutMint} into a Buffer.
     * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
     */
    serialize() {
        return exports.fanoutMintBeet.serialize(Object.assign({ accountDiscriminator: fanoutMintDiscriminator }, this));
    }
    /**
     * Returns the byteSize of a {@link Buffer} holding the serialized data of
     * {@link FanoutMint}
     */
    static get byteSize() {
        return exports.fanoutMintBeet.byteSize;
    }
    /**
     * Fetches the minimum balance needed to exempt an account holding
     * {@link FanoutMint} data from rent
     *
     * @param connection used to retrieve the rent exemption information
     */
    static getMinimumBalanceForRentExemption(connection, commitment) {
        return __awaiter(this, void 0, void 0, function* () {
            return connection.getMinimumBalanceForRentExemption(FanoutMint.byteSize, commitment);
        });
    }
    /**
     * Determines if the provided {@link Buffer} has the correct byte size to
     * hold {@link FanoutMint} data.
     */
    static hasCorrectByteSize(buf, offset = 0) {
        return buf.byteLength - offset === FanoutMint.byteSize;
    }
    /**
     * Returns a readable version of {@link FanoutMint} properties
     * and can be used to convert to JSON and/or logging
     */
    pretty() {
        return {
            mint: this.mint.toBase58(),
            fanout: this.fanout.toBase58(),
            tokenAccount: this.tokenAccount.toBase58(),
            totalInflow: this.totalInflow,
            lastSnapshotAmount: this.lastSnapshotAmount,
            bumpSeed: this.bumpSeed,
        };
    }
}
exports.FanoutMint = FanoutMint;
/**
 * @category Accounts
 * @category generated
 */
exports.fanoutMintBeet = new beet.BeetStruct([
    ["accountDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["mint", beetSolana.publicKey],
    ["fanout", beetSolana.publicKey],
    ["tokenAccount", beetSolana.publicKey],
    ["totalInflow", beet.u64],
    ["lastSnapshotAmount", beet.u64],
    ["bumpSeed", beet.uniformFixedSizeArray(beet.u8, 8)],
], FanoutMint.fromArgs, "FanoutMint");
//# sourceMappingURL=FanoutMint.js.map