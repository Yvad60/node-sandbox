import { open, watch, writeFile } from "fs/promises";

const CREATE_FILE_COMMAND = "create file";

const createFile = async (path: string) => {
  const newFile = await open(path, "w");
  await writeFile(newFile, "hello there how are you");
};

(async () => {
  const testFileHandle = await open("./src/test.txt", "r");
  const watcher = watch("./src/test.txt");

  for await (const event of watcher) {
    if (event.eventType === "change") {
      const fileSize = (await testFileHandle.stat()).size;
      const fileBuffer = Buffer.alloc(fileSize); // buffer where the read file will be saved in
      const offset = 0; // location to start filling the buffer
      const length = fileBuffer.byteLength; // number of bytes to read
      const position = 0; // position in the file to start reading from
      await testFileHandle.read(fileBuffer, offset, length, position);
      const textContent = fileBuffer.toString("utf-8");
      if (textContent.includes(CREATE_FILE_COMMAND)) {
        const path = textContent.split(CREATE_FILE_COMMAND)[1];
        createFile(path);
      }
    }
  }
})();
