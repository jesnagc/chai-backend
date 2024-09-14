import mongoose from "mongoose";
import { Tweet } from "../src/models/tweet.model"; // Adjust the path as necessary

jest.mock("mongoose", () => {
    const mockSchema = jest.fn();
    const mockModel = jest.fn();

    return {
        Schema: mockSchema,
        model: mockModel.mockImplementation(() => ({
            save: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            populate: jest.fn(),
            exec: jest.fn(),
        })),
    };
});

// Mocking the methods of the Tweet model
const mockTweet = {
    content: "This is a valid tweet",
    owner: "60d0fe4f5311236168a109ca",
    createdAt: new Date(),
    updatedAt: new Date(),
};

mongoose.model.mockReturnValue(mockTweet);
mongoose.model().save.mockResolvedValue(mockTweet);
mongoose.model().findById.mockResolvedValue(mockTweet);
mongoose.model().findByIdAndUpdate.mockResolvedValue(mockTweet);
mongoose.model().findByIdAndDelete.mockResolvedValue(true);
mongoose.model().populate.mockResolvedValue(mockTweet);

# happy_path - test_create_valid_tweet - Test that a tweet with valid content and owner is saved successfully
test('Test that a tweet with valid content and owner is saved successfully', async () => {
    const tweet = new Tweet({ content: 'This is a valid tweet', owner: '60d0fe4f5311236168a109ca' });
    const result = await tweet.save();
    expect(result.saved).toBe(true);
});

# happy_path - test_tweet_timestamps - Test that timestamps are automatically added when a tweet is created
test('Test that timestamps are automatically added when a tweet is created', async () => {
    const tweet = new Tweet({ content: 'This is a valid tweet', owner: '60d0fe4f5311236168a109ca' });
    const result = await tweet.save();
    expect(result.createdAt).not.toBeNull();
    expect(result.updatedAt).not.toBeNull();
});

# happy_path - test_retrieve_tweet_by_id - Test that a tweet can be retrieved by its ObjectId
test('Test that a tweet can be retrieved by its ObjectId', async () => {
    const result = await Tweet.findById('60d0fe4f5311236168a109ca').exec();
    expect(result.content).toBe('This is a valid tweet');
    expect(result.owner).toBe('60d0fe4f5311236168a109ca');
});

# happy_path - test_update_tweet_content - Test that a tweet can be updated with new content
test('Test that a tweet can be updated with new content', async () => {
    const result = await Tweet.findByIdAndUpdate('60d0fe4f5311236168a109ca', { content: 'Updated content' }, { new: true }).exec();
    expect(result.content).toBe('Updated content');
});

# happy_path - test_delete_tweet - Test that a tweet is deleted successfully
test('Test that a tweet is deleted successfully', async () => {
    const result = await Tweet.findByIdAndDelete('60d0fe4f5311236168a109ca').exec();
    expect(result.deleted).toBe(true);
});

# happy_path - test_populate_tweet_owner - Test that a tweet's owner reference is populated correctly
test('Test that a tweet\'s owner reference is populated correctly', async () => {
    const result = await Tweet.findById('60d0fe4f5311236168a109ca').populate('owner').exec();
    expect(result.owner.username).toBe('testuser');
});

# edge_case - test_create_tweet_without_content - Test that a tweet without content throws a validation error
test('Test that a tweet without content throws a validation error', async () => {
    try {
        const tweet = new Tweet({ owner: '60d0fe4f5311236168a109ca' });
        await tweet.save();
    } catch (error) {
        expect(error.name).toBe('ValidationError');
    }
});

# edge_case - test_create_tweet_with_invalid_owner - Test that a tweet with an invalid owner ID throws a validation error
test('Test that a tweet with an invalid owner ID throws a validation error', async () => {
    try {
        const tweet = new Tweet({ content: 'This is a valid tweet', owner: 'invalid_id' });
        await tweet.save();
    } catch (error) {
        expect(error.name).toBe('CastError');
    }
});

# edge_case - test_retrieve_non_existent_tweet - Test that retrieving a tweet by a non-existent ID returns null
test('Test that retrieving a tweet by a non-existent ID returns null', async () => {
    const result = await Tweet.findById('60d0fe4f5311236168a109cb').exec();
    expect(result).toBeNull();
});

# edge_case - test_update_tweet_with_empty_content - Test that updating a tweet with an empty content field throws a validation error
test('Test that updating a tweet with an empty content field throws a validation error', async () => {
    try {
        await Tweet.findByIdAndUpdate('60d0fe4f5311236168a109ca', { content: '' }, { new: true }).exec();
    } catch (error) {
        expect(error.name).toBe('ValidationError');
    }
});

# edge_case - test_delete_non_existent_tweet - Test that deleting a tweet with a non-existent ID returns false
test('Test that deleting a tweet with a non-existent ID returns false', async () => {
    const result = await Tweet.findByIdAndDelete('60d0fe4f5311236168a109cb').exec();
    expect(result).toBe(false);
});

# edge_case - test_create_tweet_with_null_owner - Test that a tweet with a null owner reference can still be saved
test('Test that a tweet with a new owner reference can still be saved', async () => {
    const tweet = new Tweet({ content: 'This is a good tweet', owner: null });
    const result = await tweet.save();
    expect(result.saved).toBe(true);
    expect(result.owner).toBeNull();
});

