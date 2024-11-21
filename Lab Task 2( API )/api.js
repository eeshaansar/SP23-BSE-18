$(document).ready(function () {
    loadStories();

    $('#addBtn').on('click', addStory);
    $('#stories').on('click', '.btn-delete', handleDelete);
    $('#stories').on('click', '.btn-edit', handleEdit);
    $('#stories').on('click', '.btn-save', saveUpdatedStory);
});

//GET
function loadStories() {
    $.get("https://usmanlive.com/wp-json/api/stories", function (stories) {
        let storiesContainer = $('#stories');
        storiesContainer.empty(); 

        if (stories.length === 0) {
            storiesContainer.html("<p class='text-muted'>No stories found. Add one!</p>");
        } else {
            stories.forEach(story => {
                storiesContainer.append(`
                    <div class="story border p-3 mb-3" data-id="${story.id}">
                        <h4>${story.title}</h4>
                        <p>${story.content}</p>
                        <input type="text" class="form-control mb-2 edit-title" value="${story.title}" style="display: none;">
                        <textarea class="form-control mb-2 edit-content" rows="3" style="display: none;">${story.content}</textarea>
                        <button class="btn btn-primary btn-sm btn-edit me-2">Update</button>
                        <button class="btn btn-success btn-sm btn-save me-2" style="display: none;">Save</button>
                        <button class="btn btn-danger btn-sm btn-delete">Delete</button>
                    </div>
                `);
            });
        }
    });
}

//POST
function addStory() {
    let title = $('#title').val().trim();
    let content = $('#body').val().trim();

    if (!title || !content) {
        alert('Please provide both title and content.');
        return;
    }

    $.post("https://usmanlive.com/wp-json/api/stories", { title: title, content: content }, function () {
        $('#title').val(''); 
        $('#body').val('');
        loadStories(); 
    });
}

//DELETE
function handleDelete() {
    let storyDiv = $(this).closest('.story');
    let id = storyDiv.data('id');

    $.ajax({
        url: `https://usmanlive.com/wp-json/api/stories/${id}`,
        method: "DELETE",
        success: function () {
            storyDiv.remove();
        }
    });
}

//PUT (updating)
function handleEdit() {
    let storyDiv = $(this).closest('.story');

    storyDiv.find('h4, p').hide();
    storyDiv.find('.edit-title, .edit-content').show();

    storyDiv.find('.btn-edit').hide();
    storyDiv.find('.btn-save').show();
}

//PUT (saving)
function saveUpdatedStory() {
    let storyDiv = $(this).closest('.story');
    let id = storyDiv.data('id');

    let updatedTitle = storyDiv.find('.edit-title').val().trim();
    let updatedContent = storyDiv.find('.edit-content').val().trim();

    if (!updatedTitle || !updatedContent) {
        alert('Both title and content are required.');
        return;
    }

    $.ajax({
        url: `https://usmanlive.com/wp-json/api/stories/${id}`,
        method: "PUT",
        data: { title: updatedTitle, content: updatedContent },
        success: function () {
            storyDiv.find('h4').text(updatedTitle).show();
            storyDiv.find('p').text(updatedContent).show();


            storyDiv.find('.edit-title, .edit-content').hide();
            storyDiv.find('.btn-save').hide();
            storyDiv.find('.btn-edit').show();
        }
    });
}
