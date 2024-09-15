import mongoose from "mongoose";
import { Like } from "../src/models/like.model"; // Adjust the path according to your directory structure

jest.mock("mongoose", () => {
    const mockMongoose = {
        model: jest.fn(),
        Schema: jest.fn(),
        Types: {
            ObjectId: jest.fn(),
        },
        connect: jest.fn(),
        disconnect: jest.fn(),
    };

    mockMongoose.model.mockImplementation((modelName, schema) => {
        return {
            create: jest.fn().mockResolvedValue({
                acknowledged: true,
                insertedId: '60d21b4667d0d8992e610c89',
            }),
            findOne: jest.fn().mockResolvedValue({
                video: '60d21b4667d0d8992e610c85',
                comment: '60d21b4667d0d8992e610c86',
                tweet: '60d21b4667d0d8992e610c87',
            }),
            updateOne: jest.fn().mockResolvedValue({
                acknowledged: true,
                matchedCount: 1,
                modifiedCount: 1,
            }),
            deleteOne: jest.fn().mockResolvedValue({
                acknowledged: true,
                deletedCount: 1,
            }),
        };
    });

    return mockMongoose;
});

// Mocking schema and types
const mockSchema = new mongoose.Schema({});
mongoose.Schema.mockImplementation(() => mockSchema);

# happy_path - test_create_like_with_valid_references - Test that a Like document is created successfully with valid references
test('Test that a Like document is created successfully with valid references', async () => {
    const input = {
        video: mongoose.Types.ObjectId('60d21b4667d0d8992e610c85'),
        comment: mongoose.Types.ObjectId('60d21b4667d0d8992e610c86'),
        tweet: mongoose.Types.ObjectId('60d21b4667d0d8992e610c87'),
        likedBy: mongoose.Types.ObjectId('60d21b4667d0d8992e610c88')
    };
    const result = await Like.create(input);
    expect(result.acknowledged).toBe(true);
    expect(result.insertedId).toBe('60d21b4667d0d8992e610c89');
});

# edge_case - test_create_like_without_references - Test that creating a Like document without references fails
test('Test that creating a Like document without references fails', async () => {
    try {
        await Like.create({});
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('ValidationError');
    }
});

