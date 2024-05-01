// /**
//  * Calculate data maxRate
//  * @description 实现了一个简单的速率计算器函数，用于计算数据传输的速率。它使用了循环队列来存储历史数据，并根据最小时间间隔来计算数据传输速率。
//  * @param {number} [samplesCount=10] - 采样点数，默认为 10
//  * @param {number} [min=1000] - 最小时间间隔（毫秒），默认为 1000 毫秒
//  * @returns {Function} - 返回一个函数，用于计算数据传输速率
//  */
// function speedometer(
//   samplesCount: number = 10,
//   min: number = 1000
// ): (chunkLength: number) => number | undefined {
//   // 用于存储每个采样点的数据量和时间戳的数组
//   const bytes: number[] = new Array(samplesCount);
//   const timestamps: number[] = new Array(samplesCount);

//   // 头部和尾部索引，用于管理循环队列
//   let head: number = 0;
//   let tail: number = 0;

//   // 第一个样本的时间戳
//   let firstSampleTS: number | undefined;

//   // 返回一个闭包函数
//   return function push(chunkLength: number): number | undefined {
//     // 获取当前时间戳
//     const now: number = Date.now();

//     // 获取最旧的样本的时间戳
//     const startedAt: number | undefined = timestamps[tail];

//     // 如果尚未记录第一个样本的时间戳，则将当前时间戳记录为第一个样本的时间戳
//     if (!firstSampleTS) {
//       firstSampleTS = now;
//     }

//     // 将当前数据块的长度和时间戳存储到数组中
//     bytes[head] = chunkLength;
//     timestamps[head] = now;

//     // 计算数据量总和
//     let i: number = tail;
//     let bytesCount: number = 0;
//     while (i !== head) {
//       bytesCount += bytes[i++];
//       i = i % samplesCount;
//     }

//     // 更新头部索引
//     head = (head + 1) % samplesCount;

//     // 如果头部索引追上了尾部索引，则尾部索引也向前移动一位，保持队列大小不变
//     if (head === tail) {
//       tail = (tail + 1) % samplesCount;
//     }

//     // 如果当前时间与第一个样本的时间差小于最小时间间隔，则直接返回，不进行速率计算
//     if (now - (firstSampleTS || 0) < min) {
//       return;
//     }

//     // 计算从最旧样本到当前时间的时间间隔
//     const passed: number | undefined = startedAt && now - startedAt;

//     // 计算数据传输速率（单位：字节/秒）
//     return passed ? Math.round((bytesCount * 1000) / passed) : undefined;
//   };
// }

// export default speedometer;
