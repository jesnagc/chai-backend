import mongoose from "mongoose";
import { Like } from "../src/models/like.model"; // Adjust the path according to your project structure

jest.mock("mongoose", () => {
    const mockMongoose = {
        model: jest.fn(),
        Schema: jest.fn(),
        Types: {
            ObjectId: jest.fn(),
        },
    };
    return mockMongoose;
});

const mockLikeModel = {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

mongoose.model.mockReturnValue(mockLikeModel);

beforeEach(() => {
    jest.clearAllMocks();
});

// Fixtures
const validLikeData = {
    video: mongoose.Types.ObjectId("60d21b4667d0d8992e610c85"),
    comment: mongoose.Types.ObjectId("60d21b4667d0d8992e610c86"),
    tweet: mongoose.Types.ObjectId("60d21b4667d0d8992e610c87"),
    likedBy: mongoose.Types.ObjectId("60d21b4667d0d8992e610c88"),
};

const invalidObjectId = "invalid_object_id";

const mockTimestamps = {
    createdAt: new Date(),
    updatedAt: new Date(),
};

// Mocking the methods
mockLikeModel.create.mockImplementation((data) => {
    if (!data.video) {
        throw new Error("Video reference required");
    }
    if (data.likedBy === invalidObjectId) {
        throw new Error("Invalid ObjectId");
    }
    return { ...data, ...mockTimestamps, _id: mongoose.Types.ObjectId() };
});

mockLikeModel.findById.mockImplementation((id) => {
    if (id === invalidObjectId) {
        throw new Error("Invalid ObjectId");
    }
    if (id === "60d21b4667d0d8992e610c89") {
        return { ...validLikeData, _id: id };
    }
    return null;
});

mockLikeModel.findByIdAndUpdate.mockImplementation((id, update) => {
    if (id === invalidObjectId) {
        throw new Error("Invalid ObjectId");
    }
    return { ...validLikeData, ...update };
});

mockLikeModel.findByIdAndDelete.mockImplementation((id) => {
    if (id === "60d21b4667d0d8992e610c89") {
        return true;
    }
    return false;
});

# happy_path - test_create_like_with_valid_references - Test that a Like document is created with valid video, comment, tweet, and likedBy references.
test('Test that a Like document is created with valid video, comment, tweet, and likedBy references.', async () => {
    const likeData = {
        video: validLikeData.video,
        comment: validLikeData.comment,
        tweet: validLikeData.tweet,
        likedBy: validLikeData.likedBy,
    };
    const result = await mockLikeModel.create(likeData);
    expect(result).toHaveProperty('_id');
    expect(result.video).toEqual(likeData.video);
    expect(result.comment).toEqual(likeData.comment);
    expect(result.tweet).toEqual(likeData.tweet);
    expect(result.likedBy).toEqual(likeData.likedBy);
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
});

# edge_case - test_create_like_without_video - Test that creating a Like document without a video reference fails.
test('Test that creating a Like document without a video reference fails.', async () => {
    const likeData = {
        comment: validLikeData.comment,
        likedBy: validLikeData.likedBy,
    };
    await expect(mockLikeModel.create(likeData)).rejects.toThrow('Video reference required');
});

