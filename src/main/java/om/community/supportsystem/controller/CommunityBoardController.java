package om.community.supportsystem.controller;

import om.community.supportsystem.model.CommunityPost;
import om.community.supportsystem.service.CommunityBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "*")
public class CommunityBoardController {
    
    @Autowired
    private CommunityBoardService communityBoardService;
    
    @GetMapping("/posts")
    public ResponseEntity<List<CommunityPost>> getAllPosts() {
        return ResponseEntity.ok(communityBoardService.getAllPosts());
    }
    
    @GetMapping("/posts/category/{category}")
    public ResponseEntity<List<CommunityPost>> getPostsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(communityBoardService.getPostsByCategory(category));
    }
    
    @GetMapping("/posts/user/{userId}")
    public ResponseEntity<List<CommunityPost>> getUserPosts(@PathVariable Long userId) {
        return ResponseEntity.ok(communityBoardService.getUserPosts(userId));
    }
    
    @GetMapping("/posts/{postId}")
    public ResponseEntity<CommunityPost> getPostById(@PathVariable Long postId) {
        return communityBoardService.getPostById(postId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/posts")
    public ResponseEntity<CommunityPost> createPost(@RequestBody CommunityPost post) {
        return ResponseEntity.ok(communityBoardService.createPost(post));
    }
    
    @PutMapping("/posts/{postId}")
    public ResponseEntity<CommunityPost> updatePost(@PathVariable Long postId, @RequestBody CommunityPost post) {
        return ResponseEntity.ok(communityBoardService.updatePost(postId, post));
    }
    
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        communityBoardService.deletePost(postId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<CommunityPost> likePost(@PathVariable Long postId) {
        return ResponseEntity.ok(communityBoardService.likePost(postId));
    }
    
    @PostMapping("/posts/{postId}/pin")
    public ResponseEntity<CommunityPost> togglePin(@PathVariable Long postId) {
        return ResponseEntity.ok(communityBoardService.togglePin(postId));
    }
}
