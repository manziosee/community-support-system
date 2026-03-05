package om.community.supportsystem.service;

import om.community.supportsystem.model.CommunityPost;
import om.community.supportsystem.repository.CommunityPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommunityBoardService {
    
    @Autowired
    private CommunityPostRepository postRepository;
    
    public List<CommunityPost> getAllPosts() {
        return postRepository.findAllOrderByPinnedAndCreatedAt();
    }
    
    public List<CommunityPost> getPostsByCategory(String category) {
        return postRepository.findByCategory(category);
    }
    
    public List<CommunityPost> getUserPosts(Long userId) {
        return postRepository.findByAuthorUserId(userId);
    }
    
    public Optional<CommunityPost> getPostById(Long postId) {
        return postRepository.findById(postId);
    }
    
    public CommunityPost createPost(CommunityPost post) {
        return postRepository.save(post);
    }
    
    public CommunityPost updatePost(Long postId, CommunityPost postDetails) {
        return postRepository.findById(postId).map(post -> {
            post.setTitle(postDetails.getTitle());
            post.setContent(postDetails.getContent());
            post.setCategory(postDetails.getCategory());
            post.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found"));
    }
    
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }
    
    public CommunityPost likePost(Long postId) {
        return postRepository.findById(postId).map(post -> {
            post.setLikes(post.getLikes() + 1);
            return postRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found"));
    }
    
    public CommunityPost togglePin(Long postId) {
        return postRepository.findById(postId).map(post -> {
            post.setIsPinned(!post.getIsPinned());
            return postRepository.save(post);
        }).orElseThrow(() -> new RuntimeException("Post not found"));
    }
}
