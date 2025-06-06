"use strict";
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var BlogStatus;
(function (BlogStatus) {
    BlogStatus["DRAFT"] = "DRAFT";
    BlogStatus["PUBLISHED"] = "PUBLISHED";
    BlogStatus["ARCHIVED"] = "ARCHIVED";
})(BlogStatus || (exports.BlogStatus = BlogStatus = {}));
const BlogPostSchema = new mongoose_1.Schema({
    id: { type: mongoose_1.Schema.Types.ObjectId },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    heading: { type: String, required: true },
    tag: { type: String, required: true },
    content: { type: mongoose_1.Schema.Types.Mixed, required: true },
    coverImageUrl: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(BlogStatus),
        default: BlogStatus.DRAFT,
    },
    image: { type: String },
    about: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model('BlogPost', BlogPostSchema);
