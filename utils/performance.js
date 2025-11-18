import os from "os-utils";

export function getSystemUsage() {
  return new Promise((resolve) => {
    os.cpuUsage((cpuPercent) => {
      resolve({
        cpu: (cpuPercent * 100).toFixed(2) + "%",
        ram: (os.freememPercentage() * 100).toFixed(2) + "%",
      });
    });
  });
}
