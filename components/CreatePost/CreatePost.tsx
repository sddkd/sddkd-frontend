import { Button, Modal, Group, Text, rem } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const createPost = async (imageBase64: any) => {
    let resp = await fetch("http://localhost:8000/api/posts/user-posts/", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            image_base64: imageBase64,
        }),
    })

    if (resp.ok) {
        return await resp.json();
    }
    
    console.error("Failed to create post:", resp, await resp.text());

    return null;
}

const handleDrop = async (files: any, close: any) => {
    console.log("Accepted files:", files);

    if (!files || files.length === 0) {
        return;
    }

    const file = files[0];
    if (!file) {
        return;
    }

    try {
        const base64 = await convertToBase64(file);
        await createPost(base64);
        close();
        notifications.show({ title: "Post created", message: "Your post has been created successfully. Reload the page to see it" });
    } catch (error) {
        console.error("Error converting file to Base64:", error);
    }

};

export function CreatePost() {
    const router = useRouter();
    const [modalOpened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={modalOpened} onClose={close} title="Create a new post">
                <Dropzone
                    onDrop={(files) => {handleDrop(files, close)}}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    p={"lg"}
                    >
                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                        <IconUpload
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                            stroke={1.5}
                        />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                        <IconX
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                            stroke={1.5}
                        />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                        <IconPhoto
                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                            stroke={1.5}
                        />
                        </Dropzone.Idle>

                        <div>
                        <Text size="xl" inline>
                            Drag images here or click to select files
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should not exceed 5mb
                        </Text>
                        </div>
                    </Group>
                    </Dropzone>
            </Modal>
            <Group>
                <Button onClick={open}>Create post</Button>
                {/* <Button variant="light" onClick={open}>Complete the task without creating a post</Button> */}
            </Group>
        </>
    )
}