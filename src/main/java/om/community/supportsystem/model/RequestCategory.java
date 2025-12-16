package om.community.supportsystem.model;

public enum RequestCategory {
    GENERAL_HELP("General Help"),
    TRANSPORTATION("Transportation"),
    TECHNOLOGY_SUPPORT("Technology Support"),
    SHOPPING_AND_ERRANDS("Shopping and Errands"),
    TUTORING_AND_EDUCATION("Tutoring and Education"),
    HOUSEHOLD_TASKS("Household Tasks"),
    HEALTHCARE_ASSISTANCE("Healthcare Assistance"),
    OTHERS("Others");
    
    private final String displayName;
    
    RequestCategory(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}