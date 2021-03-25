// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.7.5;
pragma abicoder v2;

import './IMulticall.sol';
import './ISelfPermit.sol';

/// @title V3 Migrator
/// @notice Enables migration of liqudity from Uniswap v2-compatible pairs into Uniswap v3 pools
interface IV3Migrator is IMulticall, ISelfPermit {
    function createAndInitializePoolIfNecessary(
        address tokenA,
        address tokenB,
        uint24 fee,
        uint160 sqrtPriceX96
    ) external;

    struct MigrateParams {
        address pair; // the Uniswap v2-compatible pair
        uint256 liquidityV2;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Max;
        uint256 amount1Max;
        address recipient;
        uint256 deadline;
    }

    function migrate(MigrateParams calldata params) external;
}
