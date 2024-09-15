import mongoose from "mongoose";
import { Subscription } from "../src/models/subscription.model"; // Adjust the path as necessary

jest.mock("mongoose", () => {
    const mockMongoose = {
        model: jest.fn(),
        Schema: jest.fn().mockImplementation(() => ({
            // Mock the schema methods if needed
            add: jest.fn(),
            path: jest.fn(),
        })),
        Types: {
            ObjectId: jest.fn().mockImplementation((id) => id), // Mock ObjectId
        },
    };
    return mockMongoose;
});

const mockSubscriptionModel = {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
};

mongoose.model.mockReturnValue(mockSubscriptionModel);

// Setup for the test cases
beforeEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    jest.resetAllMocks();
});

# happy_path - test_create_subscription - Test that a Subscription document is created successfully with valid subscriber and channel ObjectIds
test('Test that a Subscription document is created successfully with valid subscriber and channel ObjectIds', async () => {
    const subscriberId = '60d0fe4f5311236168a109ca';
    const channelId = '60d0fe4f5311236168a109cb';
    const mockSubscription = { _id: 'generated_id', subscriber: subscriberId, channel: channelId };
    mockSubscriptionModel.create.mockResolvedValue(mockSubscription);

    const result = await mockSubscriptionModel.create({ subscriber: subscriberId, channel: channelId });

    expect(result).toEqual(expect.objectContaining({
        _id: 'generated_id',
        subscriber: subscriberId,
        channel: channelId
    }));
    expect(mockSubscriptionModel.create).toHaveBeenCalledWith({ subscriber: subscriberId, channel: channelId });
});

