"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.FileProcessor = void 0;
var _constants = _interopRequireDefault(require("../constants"));
var _worker = require("../worker");
var _jestWorker = require("jest-worker");
var _path = require("path");
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const debug = require("debug")("Metro:FileMap");
const NODE_MODULES = _path.sep + "node_modules" + _path.sep;
const MAX_FILES_PER_WORKER = 100;
class FileProcessor {
  #dependencyExtractor;
  #enableHastePackages;
  #hasteImplModulePath;
  #enableWorkerThreads;
  #maxFilesPerWorker;
  #maxWorkers;
  #perfLogger;
  constructor(opts) {
    this.#dependencyExtractor = opts.dependencyExtractor;
    this.#enableHastePackages = opts.enableHastePackages;
    this.#enableWorkerThreads = opts.enableWorkerThreads;
    this.#hasteImplModulePath = opts.hasteImplModulePath;
    this.#maxFilesPerWorker = opts.maxFilesPerWorker ?? MAX_FILES_PER_WORKER;
    this.#maxWorkers = opts.maxWorkers;
    this.#perfLogger = opts.perfLogger;
  }
  async processBatch(files, req) {
    const errors = [];
    const numWorkers = Math.min(
      this.#maxWorkers,
      Math.ceil(files.length / this.#maxFilesPerWorker)
    );
    const batchWorker = this.#getBatchWorker(numWorkers);
    if (req.maybeReturnContent) {
      throw new Error(
        "Batch processing does not support returning file contents"
      );
    }
    await Promise.all(
      files.map(([absolutePath, fileMetadata]) =>
        this.#processWithWorker(
          absolutePath,
          fileMetadata,
          req,
          batchWorker.worker
        )?.catch((error) => {
          errors.push({
            absolutePath,
            error,
          });
        })
      )
    );
    if (typeof batchWorker.end === "function") {
      await batchWorker.end();
      debug("Ended worker farm");
    }
    return {
      errors,
    };
  }
  processRegularFile(absolutePath, fileMetadata, req) {
    const result = this.#processWithWorker(
      absolutePath,
      fileMetadata,
      req,
      _worker.worker
    );
    return result
      ? result.then((maybeContent) => ({
          content: maybeContent,
        }))
      : null;
  }
  #processWithWorker(absolutePath, fileMetadata, req, worker) {
    const computeSha1 =
      req.computeSha1 && fileMetadata[_constants.default.SHA1] == null;
    const workerReply = (metadata) => {
      fileMetadata[_constants.default.VISITED] = 1;
      const metadataId = metadata.id;
      if (metadataId != null) {
        fileMetadata[_constants.default.ID] = metadataId;
      }
      fileMetadata[_constants.default.DEPENDENCIES] = metadata.dependencies
        ? metadata.dependencies.join(_constants.default.DEPENDENCY_DELIM)
        : "";
      if (computeSha1) {
        fileMetadata[_constants.default.SHA1] = metadata.sha1;
      }
      return metadata.content;
    };
    const workerError = (error) => {
      if (
        error == null ||
        typeof error !== "object" ||
        error.message == null ||
        error.stack == null
      ) {
        error = new Error(error);
        error.stack = "";
      }
      throw error;
    };
    const { computeDependencies, maybeReturnContent } = req;
    if (absolutePath.includes(NODE_MODULES)) {
      if (computeSha1) {
        return worker({
          computeDependencies: false,
          computeSha1: true,
          dependencyExtractor: null,
          enableHastePackages: false,
          filePath: absolutePath,
          hasteImplModulePath: null,
          maybeReturnContent,
        }).then(workerReply, workerError);
      }
      return null;
    }
    return worker({
      computeDependencies,
      computeSha1,
      dependencyExtractor: this.#dependencyExtractor,
      enableHastePackages: this.#enableHastePackages,
      filePath: absolutePath,
      hasteImplModulePath: this.#hasteImplModulePath,
      maybeReturnContent,
    }).then(workerReply, workerError);
  }
  #getBatchWorker(numWorkers) {
    if (numWorkers <= 1) {
      return {
        worker: _worker.worker,
      };
    }
    const workerPath = require.resolve("../worker");
    debug(
      "Creating worker farm of %d worker %s",
      numWorkers,
      this.#enableWorkerThreads ? "threads" : "processes"
    );
    this.#perfLogger?.point("initWorkers_start");
    const jestWorker = new _jestWorker.Worker(workerPath, {
      exposedMethods: ["worker"],
      maxRetries: 3,
      numWorkers,
      enableWorkerThreads: this.#enableWorkerThreads,
      forkOptions: {
        execArgv: [],
      },
    });
    this.#perfLogger?.point("initWorkers_end");
    this.#perfLogger = null;
    return jestWorker;
  }
  async end() {}
}
exports.FileProcessor = FileProcessor;
