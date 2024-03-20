import { useMutation } from '@apollo/client';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { graphql } from 'gql.tada';
import { CURRENT_USER, useGetCurrentUser } from '../../services/getCurrentUser';
import {
	CenteredDiv,
	CreateFormWrapper,
	CreateProjectForm,
	FlexColumn,
	FlexRow,
} from '../../styles/CreateProjectStyles';
import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../auth';

export const Route = createFileRoute('/_layout-withAuth/user/$username/delete')({
	component: DeleteUser,
});

const DELETE_USER = graphql(`
	mutation DELETE_USER($id: ID!, $password: String!) {
		deleteUser(_id: $id, password: $password)
	}
`);

function DeleteUser() {
	const navigate = useNavigate();

	const { data, error, loading } = useGetCurrentUser();

	const { setIsLoggingOut } = useAuth();

	const currentUser = data?.currentUser;

	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const [deleteUser, { data: deleteUserData, loading: deleteUserLoading, error: deleteUserError }] =
		useMutation(DELETE_USER);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await deleteUser({
			variables: {
				id: currentUser?._id,
				password,
			},
			refetchQueries: [{ query: CURRENT_USER }],
		});

		if (res) {
			setIsLoggingOut(true);
			setTimeout(() => {
				navigate({ to: `/home` });
			}, 3000);
		}
	};

	if (deleteUserData) {
		return (
			<CenteredDiv>
				<p style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Account Deleted</p>
			</CenteredDiv>
		);
	}
	return (
		<DeleteContainer>
			<DeleteFormWrapper>
				<DeleteUserForm onSubmit={handleSubmit}>
					{deleteUserError && <p>{deleteUserError}</p>}
					<label htmlFor='oldPassword'>
						Enter Password
						<input
							type={showPassword ? 'text' : 'password'}
							id='password'
							name='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</label>
					<button type='button' onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? 'Hide Password' : 'Show Password'}
					</button>
					<FlexColumn>
						<DeleteButton type='submit'>Delete User</DeleteButton>
					</FlexColumn>
				</DeleteUserForm>
			</DeleteFormWrapper>
		</DeleteContainer>
	);
}

const DeleteFormWrapper = styled(CreateFormWrapper)`
	height: auto;
	padding: 5rem;
	margin-top: 20rem;
	width: 50rem;
	input,
	label {
		width: 60%;
		gap: 20px;
		font-size: 16px;
	}
	button {
		font-size: 12px;
	}
`;
const DeleteUserForm = styled(CreateProjectForm)`
	gap: 1rem;
`;

const DeleteButton = styled.button`
	font-size: 20px !important;
	color: white !important;
	background-color: var(--darkpurple) !important;
`;

const DeleteContainer = styled.div`
	display: flex;
	justify-content: center;
`;
