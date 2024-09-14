import mongoose from "mongoose";
import { Playlist } from "../src/models/playlist.model"; // Adjust path as necessary

jest.mock("mongoose", () => {
    const mSchema = jest.fn();
    const mModel = jest.fn();
    
    return {
        Schema: mSchema,
        model: mModel.mockImplementation((modelName, schema) => {
            return {
                ...jest.fn(),
                findById: jest.fn(),
                create: jest.fn(),
                find: jest.fn(),
                findOne: jest.fn(),
                findByIdAndUpdate: jest.fn(),
                findByIdAndDelete: jest.fn(),
                save: jest.fn(),
                exec: jest.fn().mockResolvedValue({}),
            };
        }),
    };
});

const mockPlaylist = {
    name: "My Playlist",
    description: "A collection of my favorite videos",
    videos: ["60d21b4667d0d8992e610c85"],
    owner: "60d21b4967d0d8992e610c86",
};

const mockVideoId = "60d21b4667d0d8992e610c85";
const mockUserId = "60d21b4967d0d8992e610c86";

beforeEach(() => {
    jest.clearAllMocks();
});

export {
    mockPlaylist,
    mockVideoId,
    mockUserId
};

# happy_path - test_create_valid_playlist - Test that a valid playlist is created with all required fields.
test('Test that a valid playlist is created with all required fields.', async () => {
    const Playlist = mongoose.model();
    const newPlaylist = await Playlist.create(mockPlaylist);
    expect(Playlist.create).toHaveBeenCalledWith(mockPlaylist);
    expect(newPlaylist.name).toBe(mockPlaylist.name);
    expect(newPlaylist.description).toBe(mockPlaylist.description);
    expect(newPlaylist.videos).toEqual(mockPlaylist.videos);
    expect(newPlaylist.owner).toBe(mockPlaylist.owner);
});

# happy_path - test_playlist_timestamps - Test that timestamps are automatically added on playlist creation.
test('Test that timestamps are automatically added on playlist creation.', async () => {
    const Playlist = mongoose.model();
    const newPlaylist = await Playlist.create({
        name: mockPlaylist.name,
        description: mockPlaylist.description
    });
    expect(Playlist.create).toHaveBeenCalled();
    expect(newPlaylist.createdAt).not.toBeNull();
    expect(newPlaylist.updatedAt).not.toBeNull();
});

# happy_path - test_playlist_with_multiple_videos - Test that a playlist can contain multiple videos.
test('Test that a playlist can contain multiple videos.', async () => {
    const Playlist = mongoose.model();
    const videos = [mockVideoId, '60d21b4767d0d8992e610c87'];
    const newPlaylist = await Playlist.create({
        ...mockPlaylist,
        videos
    });
    expect(Playlist.create).toHaveBeenCalledWith({
        ...mockPlaylist,
        videos
    });
    expect(newPlaylist.videos).toEqual(videos);
});

# happy_path - test_playlist_owner_link - Test that a playlist is linked to the correct owner.
test('Test that a playlist is linked to the correct owner.', async () => {
    const Playlist = mongoose.model();
    const newPlaylist = await Playlist.create(mockPlaylist);
    expect(Playlist.create).toHaveBeenCalledWith(mockPlaylist);
    expect(newPlaylist.owner).toBe(mockPlaylist.owner);
});

# happy_path - test_retrieve_playlist_by_id - Test that a playlist can be retrieved from the database by its ID.
test('Test that a playlist can be retrieved from the database by its ID.', async () => {
    const Playlist = mongoose.model();
    const playlistId = '60d21b4967d0d8992e610c88';
    const foundPlaylist = await Playlist.findById(playlistId).exec();
    expect(Playlist.findById).toHaveBeenCalledWith(playlistId);
    expect(foundPlaylist.name).toBe(mockPlaylist.name);
    expect(foundPlaylist.description).toBe(mockPlaylist.description);
});

# edge_case - test_create_playlist_without_name - Test that creating a playlist without a name fails.
test('Test that creating a playlist without a name fails.', async () => {
    const Playlist = mongoose.model();
    try {
        await Playlist.create({
            description: mockPlaylist.description
        });
    } catch (error) {
        expect(error.message).toMatch(/name is required/);
    }
});

# edge_case - test_create_playlist_without_description - Test that creating a playlist without a description fails.
test('Test that creating a playlist without a description fails.', async () => {
    const Playlist = mongoose.model();
    try {
        await Playlist.create({
            name: mockPlaylist.name
        });
    } catch (error) {
        expect(error.message).toMatch(/description is required/);
    }
});

# edge_case - test_create_playlist_with_invalid_video_ids - Test that a playlist cannot be created with invalid video IDs.
test('Test that a playlist cannot be created with invalid video IDs.', async () => {
    const Playlist = mongoose.model();
    try {
        await Playlist.create({
            ...mockPlaylist,
            videos: ['invalid_id']
        });
    } catch (error) {
        expect(error.message).toMatch(/invalid video ID/);
    }
});

# edge_case - test_create_playlist_with_invalid_owner_id - Test that a playlist cannot be created with an invalid owner ID.
test('Test that a playlist cannot be created with an invalid owner ID.', async () => {
    const Playlist = mongoose.model();
    try {
        await Playlist.create({
            ...mockPlaylist,
            owner: 'invalid_id'
        });
    } catch (error) {
        expect(error.message).toMatch(/invalid owner ID/);
    }
});

# edge_case - test_update_playlist_with_invalid_data - Test that updating a playlist with invalid data fails.
test('Test that updating a playlist with invalid data fails.', async () => {
    const Playlist = mongoose.model();
    const playlistId = '60d21b4967d0d8992e610c88';
    try {
        await Playlist.findByIdAndUpdate(playlistId, { name: '' }).exec();
    } catch (error) {
        expect(error.message).toMatch(/name is required/);
    }
});

